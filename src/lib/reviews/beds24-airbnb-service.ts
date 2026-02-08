/**
 * BEDS24 Airbnb Reviews Service
 * Fetches reviews from Airbnb via BEDS24 API (if available)
 */

import { fetchWithTokenRefresh } from '../beds24/tokenManager'
import { getGuestNameByConfirmationCode } from '../bookings/sync-bookings'

const BEDS24_API_BASE = process.env.BEDS24_API_BASE_URL || 'https://api.beds24.com/v2'

export interface AirbnbReview {
  external_id: string
  user_name: string
  user_image: string
  location: string
  rating: number
  review_date: Date
  comment: string
  source: 'airbnb'
  host_response?: string
  raw_data: any
}

/**
 * Generate avatar URL for Airbnb users
 */
function generateAirbnbAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF5A5F&color=fff&size=128`
}


/**
 * Fetch reviews from Airbnb via BEDS24 API
 */
export async function fetchAirbnbReviews(): Promise<AirbnbReview[]> {
  const ROOM_ID = process.env.BEDS24_ROOM_ID
  
  if (!ROOM_ID) {
    console.warn('BEDS24_ROOM_ID not configured')
    return []
  }

  try {
    console.log('🔍 Fetching Airbnb reviews from BEDS24...')
    console.log(`📍 Endpoint: ${BEDS24_API_BASE}/channels/airbnb/reviews?roomId=${ROOM_ID}`)
    
    // BEDS24 API requires roomId parameter for Airbnb reviews
    const response = await fetchWithTokenRefresh(
      `${BEDS24_API_BASE}/channels/airbnb/reviews?roomId=${ROOM_ID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(`📊 Response status: ${response.status} ${response.statusText}`)
    
    const result = await response.json()
    console.log('📦 Response type:', result.type, '| Count:', result.count)
    
    // BEDS24 returns data in this structure: { success, type, count, data: [...] }
    if (!result.success || !result.data || !Array.isArray(result.data)) {
      console.warn('⚠️ Invalid response from BEDS24 Airbnb reviews API')
      console.log('Response:', JSON.stringify(result).substring(0, 500))
      return []
    }

    const reviews = result.data
    console.log(`✅ Found ${reviews.length} Airbnb reviews`)

    // Map BEDS24 API response to our Review interface
    // Try to get real names from bookings by cross-referencing confirmation codes
    const mappedReviews = await Promise.all(
      reviews.map(async (review: any) => {
        let reviewerName = null
        
        // Try to get real guest name from bookings table using confirmation code
        if (review.reservation_confirmation_code) {
          reviewerName = await getGuestNameByConfirmationCode(review.reservation_confirmation_code)
          if (reviewerName) {
            console.log(`✅ Found guest name: ${reviewerName} for ${review.reservation_confirmation_code}`)
          }
        }
        
        // Fallback: Use Airbnb Guest + last 4 digits of reviewer_id
        if (!reviewerName) {
          const guestNumber = review.reviewer_id ? review.reviewer_id.slice(-4) : Math.floor(Math.random() * 9999).toString().padStart(4, '0')
          reviewerName = `Airbnb Guest ${guestNumber}`
        }
        
        return {
          external_id: `airbnb_${review.id}`,
          user_name: reviewerName,
          user_image: generateAirbnbAvatar(reviewerName),
          location: 'Airbnb',
          rating: parseInt(review.overall_rating || 5),
          review_date: new Date(review.submitted_at || review.first_completed_at || Date.now()),
          comment: review.public_review || '',
          source: 'airbnb' as const,
          host_response: review.reviewee_response || undefined,
          raw_data: review,
        }
      })
    )
    
    return mappedReviews
  } catch (error) {
    console.error('❌ Error fetching Airbnb reviews from BEDS24:', error)
    
    if (error instanceof Error) {
      console.log('Error message:', error.message)
    }
    
    return []
  }
}

/**
 * Alternative: Fetch Airbnb listings to check if reviews are available
 */
export async function checkAirbnbConnection(): Promise<boolean> {
  try {
    const response = await fetchWithTokenRefresh(
      `${BEDS24_API_BASE}/channels/airbnb/listings`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    console.log('Airbnb connection status:', data ? 'Connected' : 'Not connected')
    
    return Boolean(data && (Array.isArray(data) ? data.length > 0 : true))
  } catch (error) {
    console.log('Airbnb not connected to BEDS24')
    return false
  }
}
