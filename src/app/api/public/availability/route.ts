import { NextResponse } from 'next/server'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'
const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL

// Price multiplier for direct bookings (16% markup to match Airbnb pricing)
const DIRECT_BOOKING_MULTIPLIER = 1.16

/**
 * Public API endpoint to fetch availability and pricing
 * No authentication required - for guest viewing
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  
  // Default: fetch 3 months ahead
  const now = new Date()
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 3, 0)
  
  const formatDate = (date: Date) => date.toISOString().slice(0, 10)
  
  const startDate = from || formatDate(defaultStart)
  const endDate = to || formatDate(defaultEnd)
  
  const propertyId = process.env.BEDS24_PROPERTY_ID
  const roomId = process.env.BEDS24_ROOM_ID

  if (!propertyId || !roomId) {
    return NextResponse.json(
      { error: 'Missing BEDS24_PROPERTY_ID or BEDS24_ROOM_ID configuration' },
      { status: 500 }
    )
  }

  // Use same query as dashboard for consistency
  const url = new URL(`${getBaseUrl()}/inventory/rooms/calendar`)
  
  const queryOverride = process.env.BEDS24_INVENTORY_QUERY
  if (queryOverride) {
    const params = new URLSearchParams(queryOverride)
    params.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  } else {
    url.searchParams.set('propertyId', propertyId)
    url.searchParams.set('roomId', roomId)
    url.searchParams.set('startDate', startDate)
    url.searchParams.set('endDate', endDate)
    url.searchParams.set('includePrices', '1')
    url.searchParams.set('includeAvailability', '1')
  }

  try {
    // Fetch calendar data (prices) - using same approach as dashboard
    console.log(`🔍 Fetching calendar from: ${url.toString()}`)
    const calendarResponse = await fetchWithTokenRefresh(url.toString(), {})

    if (!calendarResponse.ok) {
      const details = await calendarResponse.text()
      console.error(`❌ Calendar request failed:`, details)
      return NextResponse.json(
        { error: 'Beds24 calendar request failed', status: calendarResponse.status, details },
        { status: 502 }
      )
    }

    const calendarData = await calendarResponse.json()
    console.log(`✅ Got calendar data:`, JSON.stringify(calendarData).substring(0, 1000))
    
    // Log sample of calendar structure
    const rooms = Array.isArray(calendarData?.data) ? calendarData.data : []
    if (rooms.length > 0 && rooms[0]?.calendar) {
      console.log(`📅 Sample calendar entry:`, JSON.stringify(rooms[0].calendar[0]).substring(0, 300))
    }
    
    // Fetch bookings using same approach as dashboard
    let bookings: any[] = []
    
    try {
      const bookingsUrl = new URL(`${getBaseUrl()}/bookings`)
      bookingsUrl.searchParams.set('propertyId', propertyId)
      bookingsUrl.searchParams.set('roomId', roomId)
      bookingsUrl.searchParams.set('arrivalFrom', '2024-01-01')
      bookingsUrl.searchParams.set('includeInvoice', 'true')
      
      console.log(`🔍 Fetching bookings from: ${bookingsUrl.toString()}`)
      const bookingsResponse = await fetchWithTokenRefresh(bookingsUrl.toString(), {})
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        console.log(`📦 Raw bookings count:`, bookingsData?.count || 0)
        
        // Extract bookings from response (Beds24 returns {success, count, data: [...]})
        bookings = Array.isArray(bookingsData) 
          ? bookingsData 
          : (Array.isArray(bookingsData?.data) ? bookingsData.data : [])
        
        console.log(`✅ Found ${bookings.length} bookings`)
        
        if (bookings.length > 0) {
          console.log(`📋 First 3 bookings:`, bookings.slice(0, 3).map(b => ({
            id: b.id,
            arrival: b.arrival,
            departure: b.departure,
            status: b.status,
            firstName: b.firstName,
            lastName: b.lastName
          })))
        }
      } else {
        const errorText = await bookingsResponse.text()
        console.error(`❌ Bookings request failed: ${bookingsResponse.status}`, errorText)
      }
    } catch (bookingsError) {
      console.warn('⚠️ Could not fetch bookings:', bookingsError instanceof Error ? bookingsError.message : String(bookingsError))
    }
    
    // Parse the calendar data and mark booked dates as unavailable
    const dates = parseCalendarData(calendarData, bookings)
    console.log(`📅 Returning ${dates.length} dates`)
    
    return NextResponse.json({ 
      dates,
      dateRange: { from: startDate, to: endDate }
    })
  } catch (error) {
    console.error(`❌ API Error:`, error)
    return NextResponse.json(
      {
        error: 'Failed to reach Beds24',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    )
  }
}

/**
 * Parse Beds24 calendar response and mark booked dates as unavailable
 */
function parseCalendarData(data: any, bookings: any[]): Array<{
  date: string
  price: number
  available: boolean
  minStay: number
}> {
  const result: Array<{
    date: string
    price: number
    available: boolean
    minStay: number
  }> = []

  // Build a set of booked dates
  const bookedDates = new Set<string>()
  for (const booking of bookings) {
    const arrival = booking?.arrival
    const departure = booking?.departure
    const status = booking?.status
    
    // Only mark confirmed/pending bookings as unavailable
    if (arrival && departure && status !== 'cancelled') {
      const checkIn = new Date(arrival)
      const checkOut = new Date(departure)
      
      // Mark all dates from check-in to check-out as booked
      let current = new Date(checkIn)
      while (current < checkOut) {
        const dateStr = current.toISOString().slice(0, 10)
        bookedDates.add(dateStr)
        current.setDate(current.getDate() + 1)
      }
    }
  }
  
  console.log(`🔒 Blocked ${bookedDates.size} dates:`, Array.from(bookedDates).slice(0, 10))

  // Handle different response formats
  const rooms = Array.isArray(data?.data) ? data.data : []
  const calendarOnly = !rooms.length && data?.calendar ? [{ calendar: data.calendar }] : []
  const sourceRooms = rooms.length ? rooms : calendarOnly

  for (const room of sourceRooms) {
    const calendars = Array.isArray(room?.calendar) ? room.calendar : []
    
    for (const calendar of calendars) {
      const rows = Array.isArray(calendar?.rows) ? calendar.rows : []
      
      for (const row of rows) {
        const date = row?.date || row?.day
        const basePrice = row?.price || row?.price1 || 0
        const minStay = row?.minStay || 1
        
        // Check if date is booked
        const isBooked = date ? bookedDates.has(date) : false
        const available = !isBooked && (row?.numAvail !== undefined ? row.numAvail > 0 : true)
        
        if (date) {
          result.push({
            date,
            price: Math.round(Number(basePrice) * DIRECT_BOOKING_MULTIPLIER),
            available,
            minStay: Number(minStay)
          })
        }
      }
      
      // Handle date range format (from/to)
      if (calendar?.from && calendar?.to) {
        const from = new Date(calendar.from)
        const to = new Date(calendar.to)
        const basePrice = calendar?.price || calendar?.price1 || 0
        const minStay = calendar?.minStay || 1
        
        let current = from
        while (current <= to) {
          const dateStr = current.toISOString().slice(0, 10)
          const isBooked = bookedDates.has(dateStr)
          const available = !isBooked && (calendar?.numAvail !== undefined ? calendar.numAvail > 0 : true)
          
          result.push({
            date: dateStr,
            price: Math.round(Number(basePrice) * DIRECT_BOOKING_MULTIPLIER),
            available,
            minStay: Number(minStay)
          })
          current = new Date(current)
          current.setDate(current.getDate() + 1)
        }
      }
    }
  }

  return result
}
