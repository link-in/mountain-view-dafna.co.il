/**
 * Google My Business Reviews Service
 * Fetches reviews from Google My Business using OAuth 2.0
 * Requires: googleapis package and OAuth 2.0 credentials
 */

export interface GoogleBusinessReview {
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
 * Map Google star rating to numeric value
 */
function mapStarRating(starRating: string): number {
  const mapping: { [key: string]: number } = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  }
  return mapping[starRating] || 5
}

/**
 * Generate avatar URL for Google users
 */
function generateGoogleAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff&size=128`
}

/**
 * Fetch reviews from Google My Business using OAuth 2.0
 * This requires proper OAuth setup in Google Cloud Console
 */
export async function fetchGoogleBusinessReviews(): Promise<GoogleBusinessReview[]> {
  // Check if credentials are configured
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN
  const googleAccountId = process.env.GOOGLE_ACCOUNT_ID
  const googleLocationId = process.env.GOOGLE_LOCATION_ID

  if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
    console.log('Google My Business credentials not configured - skipping')
    return []
  }

  if (!googleAccountId || !googleLocationId) {
    console.log('Google My Business account/location IDs not configured - skipping')
    return []
  }

  try {
    console.log('Fetching Google My Business reviews...')

    // Dynamically import googleapis to avoid issues if not installed
    const { google } = await import('googleapis')

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      googleClientId,
      googleClientSecret,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    )

    oauth2Client.setCredentials({
      refresh_token: googleRefreshToken,
    })

    // Use Google Business Profile API
    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
      version: 'v1',
      auth: oauth2Client,
    })

    // Fetch reviews
    const parent = `accounts/${googleAccountId}/locations/${googleLocationId}`
    const response = await mybusinessaccountmanagement.accounts.locations.reviews.list({
      parent,
    })

    const reviews = response.data.reviews || []
    console.log(`Found ${reviews.length} Google My Business reviews`)

    // Map to our Review interface
    return reviews.map((review: any) => ({
      external_id: `google_business_${review.name || review.reviewId || Date.now()}`,
      user_name: review.reviewer?.displayName || 'Google User',
      user_image: review.reviewer?.profilePhotoUrl || generateGoogleAvatar(review.reviewer?.displayName || 'User'),
      location: 'Google',
      rating: review.starRating ? mapStarRating(review.starRating) : 5,
      review_date: new Date(review.createTime || review.updateTime || Date.now()),
      comment: review.comment || '',
      source: 'google' as const,
      host_response: review.reviewReply?.comment || undefined,
      raw_data: review,
    }))
  } catch (error) {
    console.error('Error fetching Google My Business reviews:', error)

    // Check if googleapis is not installed
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      console.log('googleapis package not installed. Install it with: npm install googleapis')
    }

    return []
  }
}
