/**
 * Reviews Sync Service
 * Master service that fetches reviews from all sources and saves to database
 */

import { createClient } from '@supabase/supabase-js'
import { fetchBookingReviews } from './beds24-booking-service'
import { fetchAirbnbReviews } from './beds24-airbnb-service'
import { fetchGoogleBusinessReviews } from './google-business-service'
import { fetchGooglePlacesReviews } from './google-places-service'
import { syncBookings } from '../bookings/sync-bookings'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface SyncStats {
  booking: { fetched: number; saved: number; errors: number }
  airbnb: { fetched: number; saved: number; errors: number }
  google: { fetched: number; saved: number; errors: number }
  total: { fetched: number; saved: number; errors: number }
  timestamp: string
}

/**
 * Sync all reviews from all sources
 */
export async function syncAllReviews(): Promise<SyncStats> {
  const stats: SyncStats = {
    booking: { fetched: 0, saved: 0, errors: 0 },
    airbnb: { fetched: 0, saved: 0, errors: 0 },
    google: { fetched: 0, saved: 0, errors: 0 },
    total: { fetched: 0, saved: 0, errors: 0 },
    timestamp: new Date().toISOString(),
  }

  console.log('🔄 Starting reviews sync from all sources...')

  try {
    // Step 1: Sync bookings first (needed for cross-referencing Airbnb guest names)
    console.log('📦 Step 1: Syncing bookings from BEDS24...')
    try {
      const bookingsStats = await syncBookings()
      console.log(`✅ Bookings synced: ${bookingsStats.saved}/${bookingsStats.fetched}`)
    } catch (err) {
      console.warn('⚠️ Bookings sync failed (continuing with reviews):', err)
    }

    // Step 2: Fetch reviews from all sources in parallel
    console.log('📝 Step 2: Fetching reviews from all sources...')
    const [bookingResult, airbnbResult, googleBusinessResult, googlePlacesResult] = await Promise.allSettled([
      fetchBookingReviews(),
      fetchAirbnbReviews(),
      fetchGoogleBusinessReviews(),
      fetchGooglePlacesReviews(),
    ])

    // Process Booking.com reviews
    if (bookingResult.status === 'fulfilled') {
      const reviews = bookingResult.value
      stats.booking.fetched = reviews.length
      const saved = await saveReviews(reviews)
      stats.booking.saved = saved
      console.log(`✅ Booking.com: ${saved}/${reviews.length} reviews saved`)
    } else {
      stats.booking.errors = 1
      console.error('❌ Booking.com sync failed:', bookingResult.reason)
    }

    // Process Airbnb reviews
    if (airbnbResult.status === 'fulfilled') {
      const reviews = airbnbResult.value
      stats.airbnb.fetched = reviews.length
      const saved = await saveReviews(reviews)
      stats.airbnb.saved = saved
      console.log(`✅ Airbnb: ${saved}/${reviews.length} reviews saved`)
    } else {
      stats.airbnb.errors = 1
      console.error('❌ Airbnb sync failed:', airbnbResult.reason)
    }

    // Process Google My Business reviews
    if (googleBusinessResult.status === 'fulfilled') {
      const reviews = googleBusinessResult.value
      stats.google.fetched += reviews.length
      const saved = await saveReviews(reviews)
      stats.google.saved += saved
      console.log(`✅ Google My Business: ${saved}/${reviews.length} reviews saved`)
    } else {
      stats.google.errors += 1
      console.error('❌ Google My Business sync failed:', googleBusinessResult.reason)
    }

    // Process Google Places reviews
    if (googlePlacesResult.status === 'fulfilled') {
      const reviews = googlePlacesResult.value
      stats.google.fetched += reviews.length
      const saved = await saveReviews(reviews)
      stats.google.saved += saved
      console.log(`✅ Google Places: ${saved}/${reviews.length} reviews saved`)
    } else {
      stats.google.errors += 1
      console.error('❌ Google Places sync failed:', googlePlacesResult.reason)
    }

    // Calculate totals
    stats.total.fetched = stats.booking.fetched + stats.airbnb.fetched + stats.google.fetched
    stats.total.saved = stats.booking.saved + stats.airbnb.saved + stats.google.saved
    stats.total.errors = stats.booking.errors + stats.airbnb.errors + stats.google.errors

    console.log(`✨ Sync completed: ${stats.total.saved}/${stats.total.fetched} reviews saved`)

    return stats
  } catch (error) {
    console.error('❌ Fatal error during sync:', error)
    throw error
  }
}

/**
 * Save reviews to Supabase database
 * Uses smart upsert to preserve manually updated names
 * 
 * Logic:
 * - New reviews: Insert with fetched name
 * - Existing reviews with "Airbnb Guest": Update name from fetch
 * - Existing reviews with real names: Keep the existing name (manual override)
 */
async function saveReviews(reviews: any[]): Promise<number> {
  if (reviews.length === 0) {
    return 0
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    let savedCount = 0

    // Process each review individually to preserve manual name updates
    for (const review of reviews) {
      try {
        // Check if review already exists
        const { data: existing } = await supabase
          .from('reviews')
          .select('id, user_name')
          .eq('external_id', review.external_id)
          .single()

        const reviewData: any = {
          external_id: review.external_id,
          user_image: review.user_image,
          location: review.location,
          rating: review.rating,
          review_date: review.review_date.toISOString(),
          comment: review.comment,
          source: review.source,
          host_response: review.host_response || null,
          raw_data: review.raw_data,
          is_active: true,
        }

        // Preserve manually updated names
        if (existing) {
          // If existing name is NOT "Airbnb Guest XXXX", keep it (manual override)
          const hasManualName = existing.user_name && !existing.user_name.startsWith('Airbnb Guest')
          
          if (hasManualName) {
            // Keep the existing manual name
            reviewData.user_name = existing.user_name
            console.log(`🔒 Preserving manual name: ${existing.user_name} for ${review.external_id}`)
          } else {
            // Update with fetched name (it might have improved)
            reviewData.user_name = review.user_name
          }
        } else {
          // New review - use fetched name
          reviewData.user_name = review.user_name
        }

        // Upsert
        const { error } = await supabase
          .from('reviews')
          .upsert(reviewData, {
            onConflict: 'external_id',
            ignoreDuplicates: false,
          })

        if (error) {
          console.error(`Error saving review ${review.external_id}:`, error.message)
        } else {
          savedCount++
        }
      } catch (err) {
        console.error(`Error processing review:`, err)
      }
    }

    return savedCount
  } catch (error) {
    console.error('Error in saveReviews:', error)
    return 0
  }
}

/**
 * Get sync statistics from the database
 */
export async function getSyncStats(): Promise<{
  totalReviews: number
  bySource: { [key: string]: number }
  averageRating: number
  lastSync: string | null
}> {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get total count and stats
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('source, rating, created_at, updated_at')
      .eq('is_active', true)

    if (error || !reviews) {
      return {
        totalReviews: 0,
        bySource: {},
        averageRating: 0,
        lastSync: null,
      }
    }

    // Calculate stats
    const bySource: { [key: string]: number } = {}
    let totalRating = 0

    reviews.forEach((review) => {
      bySource[review.source] = (bySource[review.source] || 0) + 1
      totalRating += review.rating
    })

    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    // Get last sync time (most recent updated_at)
    const lastSync = reviews.length > 0 
      ? reviews.reduce((latest, review) => {
          const reviewDate = new Date(review.updated_at || review.created_at)
          return reviewDate > new Date(latest) ? review.updated_at || review.created_at : latest
        }, reviews[0].updated_at || reviews[0].created_at)
      : null

    return {
      totalReviews: reviews.length,
      bySource,
      averageRating: Math.round(averageRating * 10) / 10,
      lastSync,
    }
  } catch (error) {
    console.error('Error getting sync stats:', error)
    return {
      totalReviews: 0,
      bySource: {},
      averageRating: 0,
      lastSync: null,
    }
  }
}
