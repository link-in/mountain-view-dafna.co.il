/**
 * BEDS24 Booking.com Reviews Service
 * Fetches reviews from Booking.com via BEDS24 API
 */

import { fetchWithTokenRefresh } from '../beds24/tokenManager'

const BEDS24_API_BASE = process.env.BEDS24_API_BASE_URL || 'https://api.beds24.com/v2'
const BEDS24_PROPERTY_ID = process.env.BEDS24_PROPERTY_ID

export interface BookingReview {
  external_id: string
  user_name: string
  user_image: string
  location: string
  rating: number
  review_date: Date
  comment: string
  source: 'booking'
  host_response?: string
  raw_data: any
}

/**
 * Generate avatar URL for Booking.com users
 * Booking.com doesn't provide profile images, so we use ui-avatars.com
 */
function generateBookingAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=003580&color=fff&size=128`
}

/**
 * Fetch reviews from Booking.com via BEDS24 API
 * Requires propertyId and from date parameters
 */
export async function fetchBookingReviews(): Promise<BookingReview[]> {
  if (!BEDS24_PROPERTY_ID) {
    console.warn('BEDS24_PROPERTY_ID not configured')
    return []
  }

  try {
    // Get reviews from the last 2 years
    const fromDate = new Date()
    fromDate.setFullYear(fromDate.getFullYear() - 2)
    const fromDateStr = fromDate.toISOString().split('T')[0] // YYYY-MM-DD
    
    console.log('🔍 Fetching Booking.com reviews from BEDS24...')
    console.log(`📍 Endpoint: ${BEDS24_API_BASE}/channels/booking/reviews?propertyId=${BEDS24_PROPERTY_ID}&from=${fromDateStr}`)
    
    // Booking.com requires propertyId and from date
    const response = await fetchWithTokenRefresh(
      `${BEDS24_API_BASE}/channels/booking/reviews?propertyId=${BEDS24_PROPERTY_ID}&from=${fromDateStr}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(`📊 Response status: ${response.status} ${response.statusText}`)
    
    const result = await response.json()
    
    // Check if it's an error response
    if (!result.success) {
      console.log('ℹ️ Booking.com reviews not available (may not be connected to BEDS24)')
      console.log('API Response:', JSON.stringify(result).substring(0, 200))
      return []
    }
    
    console.log('📦 Response type:', result.type, '| Count:', result.count)
    
    // BEDS24 returns data in this structure: { success, type, count, data: [...] }
    if (!result.data || !Array.isArray(result.data)) {
      console.warn('⚠️ Invalid response from BEDS24 Booking.com reviews API')
      return []
    }

    const reviews = result.data
    console.log(`✅ Found ${reviews.length} Booking.com reviews`)

    // Map BEDS24 Booking.com API response to our Review interface
    return reviews.map((review: any) => {
      // Booking.com scores are out of 10, convert to 5-star rating
      const score = review.scoring?.review_score || 10
      const rating = Math.round(score / 2) // 10 -> 5, 8 -> 4, 6 -> 3, etc.
      
      // Get reviewer info
      const reviewerName = review.reviewer?.name || 'אנונימי'
      const countryCode = review.reviewer?.country_code?.toUpperCase() || 'IL'
      const location = countryCode === 'IL' ? 'ישראל' : countryCode
      
      // Combine positive and negative feedback
      const positive = review.content?.positive || ''
      const negative = review.content?.negative || ''
      let comment = positive
      
      if (negative) {
        comment += `\n\nנקודות לשיפור: ${negative}`
      }
      
      // Get host reply if exists
      const hostResponse = review.reply?.content || undefined
      
      return {
        external_id: `booking_${review.review_id}`,
        user_name: reviewerName,
        user_image: generateBookingAvatar(reviewerName),
        location: location,
        rating: rating,
        review_date: new Date(review.created_timestamp || Date.now()),
        comment: comment,
        source: 'booking' as const,
        host_response: hostResponse,
        raw_data: review,
      }
    })
  } catch (error) {
    console.error('❌ Error fetching Booking.com reviews from BEDS24:', error)
    
    if (error instanceof Error) {
      console.log('Error message:', error.message)
    }
    
    return []
  }
}
