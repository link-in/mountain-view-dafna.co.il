import { NextResponse } from 'next/server'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'
const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL

/**
 * Public API endpoint to create bookings
 * No authentication required - for guest bookings from landing page
 */
export async function POST(request: Request) {
  let requestBody: unknown
  try {
    requestBody = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // Validate required fields
  if (!requestBody || typeof requestBody !== 'object') {
    return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 })
  }

  const booking = requestBody as Record<string, unknown>
  
  // Required fields validation
  const requiredFields = ['firstName', 'lastName', 'email', 'checkIn', 'checkOut']
  const missingFields = requiredFields.filter(field => !booking[field])
  
  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    )
  }

  const propertyId = process.env.BEDS24_PROPERTY_ID
  const roomId = process.env.BEDS24_ROOM_ID

  if (!propertyId || !roomId) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  // Build Beds24 booking payload
  const beds24Booking = {
    propertyId: Number(propertyId),
    roomId: Number(roomId),
    arrival: booking.checkIn,
    departure: booking.checkOut,
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    mobile: booking.phone || '',
    numAdult: Number(booking.numAdult) || 1,
    numChild: Number(booking.numChild) || 0,
    status: 'confirmed',
    notes: booking.notes || '',
  }

  console.log('📝 Creating public booking:', {
    guest: `${beds24Booking.firstName} ${beds24Booking.lastName}`,
    dates: `${beds24Booking.arrival} - ${beds24Booking.departure}`,
    adults: beds24Booking.numAdult,
    children: beds24Booking.numChild,
  })

  try {
    // Create booking in Beds24
    const response = await fetchWithTokenRefresh(`${getBaseUrl()}/bookings`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify([beds24Booking]),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('❌ Beds24 booking failed:', details)
      return NextResponse.json(
        { error: 'Failed to create booking', details },
        { status: 502 }
      )
    }

    const data = await response.json()
    console.log('✅ Beds24 booking created:', data)

    // Extract booking ID from response
    const bookingId = Array.isArray(data) && data[0]?.new?.id 
      ? String(data[0].new.id)
      : (Array.isArray(data) && data[0]?.bookingId ? String(data[0].bookingId) : 'N/A')

    // Send notifications in the background (don't block response)
    sendNotifications(beds24Booking, bookingId, data).catch(error => {
      console.error('❌ Error sending notifications:', error)
    })

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'הזמנה נוצרה בהצלחה! נשלחה אליך הודעת אישור.',
    })
  } catch (error) {
    console.error('❌ Error creating booking:', error)
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * Send WhatsApp notifications to guest and owner
 * Saves to notifications_log in Supabase
 */
async function sendNotifications(
  booking: Record<string, unknown>,
  bookingId: string,
  beds24Response: unknown
) {
  const guestName = `${String(booking.firstName || '')} ${String(booking.lastName || '')}`.trim()
  const guestPhone = String(booking.mobile || '')
  const guestEmail = String(booking.email || '')
  const checkInDate = String(booking.arrival || '')
  const checkOutDate = String(booking.departure || '')
  const numAdult = Number(booking.numAdult) || 1
  const numChild = Number(booking.numChild) || 0

  console.log('📬 Starting notification process...')

  try {
    // Save to Supabase notifications_log
    const supabase = createServerClient()
    const { data: logData, error: logError } = await supabase
      .from('notifications_log')
      .insert({
        guest_name: guestName,
        phone: guestPhone,
        check_in_date: checkInDate,
        raw_payload: {
          source: 'public_booking',
          booking,
          beds24Response,
        },
        status: 'received',
        created_at: new Date().toISOString(),
      })
      .select()

    if (logError) {
      console.error('❌ Failed to save to notifications_log:', logError)
    } else {
      console.log('✅ Saved to Supabase notifications_log')
    }

    const recordId = logData?.[0]?.id

    // Send WhatsApp to guest
    let guestWhatsAppSuccess = false
    if (guestPhone) {
      const guestResult = await sendWhatsAppMessage({
        to: guestPhone,
        message: `שלום ${guestName}! 🏔️\n\nקיבלנו את הזמנתך במאונטיין וויו.\n📅 תאריך כניסה: ${checkInDate}\n📅 תאריך יציאה: ${checkOutDate}\n👥 מבוגרים: ${numAdult}${numChild > 0 ? `\n👶 ילדים: ${numChild}` : ''}\n🔖 מספר הזמנה: ${bookingId}\n\nנשמח לארח אותך! 🎉`,
      })
      guestWhatsAppSuccess = guestResult.success
      console.log(`📱 Guest WhatsApp: ${guestResult.success ? '✅' : '❌'} ${guestResult.error || ''}`)
    }

    // Send WhatsApp to owner (using env variable)
    const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER
    if (ownerPhone) {
      const ownerResult = await sendWhatsAppMessage({
        to: ownerPhone,
        message: `🔔 הזמנה חדשה דרך האתר!\n\n👤 אורח: ${guestName}\n📱 טלפון: ${guestPhone || 'לא צוין'}\n📧 אימייל: ${guestEmail}\n📅 כניסה: ${checkInDate}\n📅 יציאה: ${checkOutDate}\n👥 מבוגרים: ${numAdult}${numChild > 0 ? `\n👶 ילדים: ${numChild}` : ''}\n🔖 מספר הזמנה: ${bookingId}`,
      })
      console.log(`📱 Owner WhatsApp: ${ownerResult.success ? '✅' : '❌'} ${ownerResult.error || ''}`)
    }

    // Update notification log with status
    if (recordId) {
      await supabase
        .from('notifications_log')
        .update({
          status: guestWhatsAppSuccess ? 'sent' : 'failed',
          whatsapp_sent_at: guestWhatsAppSuccess ? new Date().toISOString() : null,
        })
        .eq('id', recordId)
    }
  } catch (error) {
    console.error('❌ Error in sendNotifications:', error)
  }
}
