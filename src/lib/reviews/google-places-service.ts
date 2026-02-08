/**
 * Google Places Reviews Service
 * Fetches reviews from Google Places API (simpler than My Business API)
 * Requires: Google Places API key and Place ID
 */

export interface GooglePlacesReview {
  external_id: string
  user_name: string
  user_image: string
  location: string
  rating: number
  review_date: Date
  comment: string
  source: 'google'
  host_response?: string
  raw_data: any
}

/**
 * Generate avatar URL for Google users
 */
function generateGoogleAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff&size=128`
}

/**
 * Fetch reviews from Google Places API
 * This is simpler than My Business API and only requires an API key
 */
export async function fetchGooglePlacesReviews(): Promise<GooglePlacesReview[]> {
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  const googlePlaceId = process.env.GOOGLE_PLACE_ID

  if (!googleApiKey || !googlePlaceId) {
    console.log('Google Places API credentials not configured - skipping')
    return []
  }

  try {
    console.log('Fetching Google Places reviews...')

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=reviews,rating,user_ratings_total&key=${googleApiKey}&language=he`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message)
      return []
    }

    const reviews = data.result?.reviews || []
    console.log(`Found ${reviews.length} Google Places reviews`)

    // Map to our Review interface
    return reviews.map((review: any) => ({
      external_id: `google_places_${review.time}_${review.author_name}`,
      user_name: review.author_name || 'Google User',
      user_image: review.profile_photo_url || generateGoogleAvatar(review.author_name || 'User'),
      location: 'Google',
      rating: parseInt(review.rating) || 5,
      review_date: new Date(review.time * 1000), // Convert Unix timestamp to Date
      comment: review.text || '',
      source: 'google' as const,
      host_response: undefined, // Places API doesn't include owner responses
      raw_data: review,
    }))
  } catch (error) {
    console.error('Error fetching Google Places reviews:', error)
    return []
  }
}

/**
 * Get place details including aggregate rating
 */
export async function getPlaceAggregateRating(): Promise<{
  rating: number
  totalReviews: number
} | null> {
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  const googlePlaceId = process.env.GOOGLE_PLACE_ID

  if (!googleApiKey || !googlePlaceId) {
    return null
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=rating,user_ratings_total&key=${googleApiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      return null
    }

    return {
      rating: data.result?.rating || 0,
      totalReviews: data.result?.user_ratings_total || 0,
    }
  } catch (error) {
    console.error('Error fetching place aggregate rating:', error)
    return null
  }
}
