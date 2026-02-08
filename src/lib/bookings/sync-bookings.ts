/**
 * Bookings Sync Service
 * Fetches bookings from BEDS24 and saves to local database
 */

import { createClient } from '@supabase/supabase-js'
import { fetchWithTokenRefresh } from '../beds24/tokenManager'

const BEDS24_API_BASE = process.env.BEDS24_API_BASE_URL || 'https://api.beds24.com/v2'
const BEDS24_PROPERTY_ID = process.env.BEDS24_PROPERTY_ID
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Sync bookings from BEDS24 to local database
 * Fetches bookings from the last year
 */
export async function syncBookings(): Promise<{
  success: boolean
  fetched: number
  saved: number
  errors: number
}> {
  const stats = {
    success: false,
    fetched: 0,
    saved: 0,
    errors: 0,
  }

  try {
    if (!BEDS24_PROPERTY_ID) {
      console.warn('BEDS24_PROPERTY_ID not configured')
      return stats
    }

    // Fetch bookings from the last 3 years (to cover all reviews)
    const fromDate = new Date()
    fromDate.setFullYear(fromDate.getFullYear() - 3)
    const fromDateStr = fromDate.toISOString().split('T')[0]

    console.log('🔍 Fetching bookings from BEDS24...')
    console.log(`📍 From date: ${fromDateStr}`)

    const response = await fetchWithTokenRefresh(
      `${BEDS24_API_BASE}/bookings?propertyId=${BEDS24_PROPERTY_ID}&arrivalFrom=${fromDateStr}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`❌ BEDS24 API error: ${response.status} ${response.statusText}`)
      return stats
    }

    const result = await response.json()
    
    // BEDS24 returns { data: [...] } format
    const bookings = result.data || result
    
    if (!bookings || !Array.isArray(bookings)) {
      console.warn('⚠️ Invalid response from BEDS24 bookings API')
      console.log('Response structure:', result)
      return stats
    }

    stats.fetched = bookings.length
    console.log(`✅ Found ${bookings.length} bookings`)

    // Save to database
    const supabase = createClient(supabaseUrl, supabaseKey)

    for (const booking of bookings) {
      try {
        // Extract the Airbnb confirmation code from apiReference
        const confirmationCode = booking.apiReference || booking.confirmationCode || null
        
        const bookingData = {
          booking_id: booking.id?.toString() || booking.bookId?.toString(),
          reference: booking.reference || null,
          confirmation_code: confirmationCode,
          property_id: booking.propertyId?.toString() || null,
          room_id: booking.roomId?.toString() || null,
          first_name: booking.firstName || null,
          last_name: booking.lastName || null,
          email: booking.guestEmail || booking.email || null,
          phone: booking.phone || null,
          mobile: booking.mobile || null,
          address: booking.address || null,
          city: booking.city || null,
          country: booking.country || booking.country2 || null,
          arrival: booking.arrival || booking.firstNight || null,
          departure: booking.departure || booking.lastNight || null,
          num_adults: parseInt(booking.numAdult || booking.adults || '0'),
          num_children: parseInt(booking.numChild || booking.children || '0'),
          status: booking.status || null,
          price: parseFloat(booking.price || booking.total || '0'),
          currency: booking.currency || 'ILS',
          channel: booking.channel || getChannelFromReference(booking.apiReference || booking.reference),
          raw_data: booking,
          synced_at: new Date().toISOString(),
        }
        
        console.log(`💾 Saving booking ${booking.id} - ${bookingData.first_name} ${bookingData.last_name} (${bookingData.channel}) - Code: ${confirmationCode}`)

        const { error } = await supabase
          .from('bookings')
          .upsert(bookingData, {
            onConflict: 'booking_id',
            ignoreDuplicates: false,
          })

        if (error) {
          console.error(`❌ Error saving booking ${booking.id}:`, error.message)
          stats.errors++
        } else {
          stats.saved++
        }
      } catch (err) {
        console.error(`❌ Error processing booking:`, err)
        stats.errors++
      }
    }

    stats.success = stats.errors === 0
    console.log(`✨ Bookings sync complete: ${stats.saved}/${stats.fetched} saved, ${stats.errors} errors`)

    return stats
  } catch (error) {
    console.error('❌ Fatal error during bookings sync:', error)
    return stats
  }
}

/**
 * Determine channel from booking reference
 */
function getChannelFromReference(reference: string | null): string {
  if (!reference) return 'direct'
  
  const ref = reference.toUpperCase()
  
  if (ref.startsWith('HM')) return 'airbnb' // Airbnb codes start with HM
  if (ref.match(/^\d+$/)) return 'booking' // Booking.com uses numeric codes
  
  return 'direct'
}

/**
 * Get guest name from bookings by Airbnb confirmation code
 */
export async function getGuestNameByConfirmationCode(confirmationCode: string): Promise<string | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Search by confirmation_code (Airbnb codes like HM... are stored here)
    const { data, error } = await supabase
      .from('bookings')
      .select('first_name, last_name')
      .eq('confirmation_code', confirmationCode)
      .single()
    
    if (error || !data) {
      console.log(`⚠️ No booking found for confirmation code: ${confirmationCode}`)
      return null
    }
    
    if (data.first_name && data.last_name) {
      return `${data.first_name} ${data.last_name}`
    }
    
    return data.first_name || null
  } catch (err) {
    console.error(`❌ Error finding guest name for ${confirmationCode}:`, err)
    return null
  }
}
