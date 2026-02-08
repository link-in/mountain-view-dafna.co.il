import { NextResponse } from 'next/server'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PROPERTY_ID = '306559'
const ROOM_ID = '638851'

/**
 * Public API endpoint to calculate exact price based on dates and number of guests
 * Returns the total price including any surcharges for extra guests
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { checkIn, checkOut, numAdult, numChild } = body

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields: checkIn, checkOut' },
        { status: 400 }
      )
    }

    console.log('💰 Calculating price:', { checkIn, checkOut, numAdult, numChild })

    // Fetch calendar data for the date range
    const calendarUrl = new URL('https://api.beds24.com/v2/inventory/rooms/calendar')
    calendarUrl.searchParams.set('propertyId', PROPERTY_ID)
    calendarUrl.searchParams.set('roomId', ROOM_ID)
    calendarUrl.searchParams.set('startDate', checkIn)
    calendarUrl.searchParams.set('endDate', checkOut)
    calendarUrl.searchParams.set('includePrices', '1')

    const calendarResponse = await fetchWithTokenRefresh(calendarUrl.toString())
    const calendarData = await calendarResponse.json()

    const calendar = calendarData.data?.[0]?.calendar || []
    
    if (calendar.length === 0) {
      return NextResponse.json(
        { error: 'No pricing data available for selected dates' },
        { status: 404 }
      )
    }

    // Calculate base price (sum of all nights)
    let totalPrice = 0
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

    // Build date-to-price map
    const priceMap: Record<string, number> = {}
    calendar.forEach((entry: any) => {
      const from = new Date(entry.from)
      const to = new Date(entry.to)
      const price = entry.price1 || 0

      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0]
        priceMap[dateKey] = price
      }
    })

    // Calculate total for each night
    for (let d = new Date(checkInDate); d < checkOutDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0]
      totalPrice += priceMap[dateKey] || 0
    }

    // Apply guest surcharges (if applicable)
    // For example: extra charge for more than 2 adults or any children
    const baseGuests = 2
    const extraAdults = Math.max(0, (numAdult || 2) - baseGuests)
    const extraChildren = numChild || 0
    
    // Example pricing logic - adjust according to your business rules:
    const adultSurcharge = 50 // ₪50 per extra adult per night
    const childSurcharge = 30 // ₪30 per child per night
    
    const extraGuestsCost = (extraAdults * adultSurcharge + extraChildren * childSurcharge) * nights

    const finalPrice = totalPrice + extraGuestsCost

    console.log('💰 Price calculation:', {
      basePrice: totalPrice,
      extraGuestsCost,
      finalPrice,
      nights,
      extraAdults,
      extraChildren
    })

    return NextResponse.json({
      success: true,
      price: finalPrice,
      breakdown: {
        basePrice: totalPrice,
        nights,
        numAdult: numAdult || 2,
        numChild: numChild || 0,
        extraAdults,
        extraChildren,
        adultSurcharge: extraAdults * adultSurcharge * nights,
        childSurcharge: extraChildren * childSurcharge * nights,
        totalSurcharge: extraGuestsCost,
      }
    })
  } catch (error) {
    console.error('❌ Error calculating price:', error)
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    )
  }
}
