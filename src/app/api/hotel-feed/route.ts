import { NextResponse } from 'next/server'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'

const PROPERTY_ID = '306559'
const ROOM_ID = '638851'

export async function GET() {
  try {
    // Fetch availability for next 180 days
    const today = new Date()
    const sixMonthsLater = new Date(today)
    sixMonthsLater.setMonth(today.getMonth() + 6)

    const startDate = today.toISOString().split('T')[0]
    const endDate = sixMonthsLater.toISOString().split('T')[0]

    // Fetch calendar data
    const calendarUrl = new URL('https://api.beds24.com/v2/inventory/rooms/calendar')
    calendarUrl.searchParams.set('propertyId', PROPERTY_ID)
    calendarUrl.searchParams.set('roomId', ROOM_ID)
    calendarUrl.searchParams.set('startDate', startDate)
    calendarUrl.searchParams.set('endDate', endDate)
    calendarUrl.searchParams.set('includePrices', '1')
    calendarUrl.searchParams.set('includeAvailability', '1')

    const calendarResponse = await fetchWithTokenRefresh(calendarUrl.toString())
    const calendarData = await calendarResponse.json()

    // Fetch bookings
    const bookingsUrl = new URL('https://api.beds24.com/v2/bookings')
    bookingsUrl.searchParams.set('propertyId', PROPERTY_ID)
    bookingsUrl.searchParams.set('roomId', ROOM_ID)
    bookingsUrl.searchParams.set('arrivalFrom', startDate)
    bookingsUrl.searchParams.set('arrivalTo', endDate)
    bookingsUrl.searchParams.set('includeInvoice', 'true')

    const bookingsResponse = await fetchWithTokenRefresh(bookingsUrl.toString())
    const bookingsData = await bookingsResponse.json()

    // Parse data
    const calendar = calendarData.data?.[0]?.calendar || []
    const bookings = Array.isArray(bookingsData) ? bookingsData : (Array.isArray(bookingsData?.data) ? bookingsData.data : [])

    // Build date availability map
    const blockedDates = new Set<string>()
    bookings.forEach((booking: any) => {
      if (booking.status === 'confirmed' || booking.status === 'new' || booking.status === 'pending') {
        const arrival = new Date(booking.arrival)
        const departure = new Date(booking.departure)
        
        for (let d = new Date(arrival); d < departure; d.setDate(d.getDate() + 1)) {
          blockedDates.add(d.toISOString().split('T')[0])
        }
      }
    })

    // Generate XML
    const items: string[] = []
    
    calendar.forEach((entry: any) => {
      const fromDate = new Date(entry.from)
      const toDate = new Date(entry.to)
      const price = entry.price1 || 0

      for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const isAvailable = !blockedDates.has(dateStr) && d >= today

        items.push(`
    <result>
      <id>638851</id>
      <property>mountain-view-dafna</property>
      <room_id>638851</room_id>
      <name>נוף הרים בדפנה</name>
      <address>דפנה, צפון, ישראל</address>
      <latitude>33.2363</latitude>
      <longitude>35.6528</longitude>
      <date>${dateStr}</date>
      <price currency="ILS">${price}</price>
      <availability>${isAvailable ? 1 : 0}</availability>
      <checkin>15:00</checkin>
      <checkout>11:00</checkout>
      <occupancy>2</occupancy>
      <url>https://mountain-view-dafna.co.il</url>
    </result>`)
      }
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <language>he</language>
  <listing>
    <id>638851</id>
    <name>נוף הרים בדפנה</name>
    <address>דפנה</address>
    <city>דפנה</city>
    <region>צפון</region>
    <postal_code>12245</postal_code>
    <country>IL</country>
    <latitude>33.2363</latitude>
    <longitude>35.6528</longitude>
    <phone>+972-52-383-0063</phone>
    <category>hotel</category>
    <content>
      <text>צימר מפנק בדפנה בין פלגי הדן אל מול נופי חרמון. חדר שינה יוקרתי, ג'קוזי ספא, נוף פנורמי להרים, מטבח מאובזר ופינת ישיבה נעימה. המקום המושלם לחופשה רומנטית בצפון.</text>
      <link>https://mountain-view-dafna.co.il</link>
    </content>
    <image>https://mountain-view-dafna.co.il/images/hero-1.jpg</image>
    <image>https://mountain-view-dafna.co.il/images/hero-2.jpg</image>
    <image>https://mountain-view-dafna.co.il/images/hero-3.jpg</image>
  </listing>${items.join('')}
</listings>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // Cache for 10 minutes
      },
    })
  } catch (error) {
    console.error('Error generating hotel feed:', error)
    return NextResponse.json(
      { error: 'Failed to generate hotel feed' },
      { status: 500 }
    )
  }
}
