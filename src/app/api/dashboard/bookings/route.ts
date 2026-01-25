import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { createServerClient } from '@/lib/supabase/server'
import { getUserByEmail } from '@/lib/auth/getUsersDb'

export const dynamic = 'force-dynamic'  // Allow POST requests for creating bookings
export const revalidate = 0

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'

const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL

export async function GET() {
  const url = new URL(`${getBaseUrl()}/bookings`)
  const query = process.env.BEDS24_BOOKINGS_QUERY
  if (query) {
    const params = new URLSearchParams(query)
    params.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  } else {
    url.searchParams.set('arrivalFrom', '2024-01-01')
    url.searchParams.set('includeInvoice', 'true')
  }

  try {
    const response = await fetchWithTokenRefresh(url.toString())

    if (!response.ok) {
      const details = await response.text()
      return NextResponse.json(
        { error: 'Beds24 request failed', status: response.status, details },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to reach Beds24',
        details: error instanceof Error ? error.message : String(error),
        endpoint: url.toString(),
      },
      { status: 502 }
    )
  }
}

export async function POST(request: Request) {
  let requestBody: unknown
  try {
    requestBody = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // Extract payload and sendWhatsApp flag
  let payload: unknown
  let sendWhatsApp = true // Default: send WhatsApp
  
  if (requestBody && typeof requestBody === 'object' && 'bookings' in requestBody) {
    // New format: { bookings: [...], sendWhatsApp: true/false }
    payload = (requestBody as { bookings: unknown }).bookings
    sendWhatsApp = (requestBody as { sendWhatsApp?: boolean }).sendWhatsApp ?? true
    console.log('📧 sendWhatsApp flag:', sendWhatsApp)
  } else {
    // Old format: direct array or object (for backwards compatibility)
    payload = requestBody
  }

  const session = await getServerSession(authOptions)
  const propertyId = session?.user?.propertyId ?? process.env.BEDS24_PROPERTY_ID
  const roomId = session?.user?.roomId ?? process.env.BEDS24_ROOM_ID

  if (!propertyId || !roomId) {
    return NextResponse.json({ error: 'Missing BEDS24_PROPERTY_ID or BEDS24_ROOM_ID' }, { status: 500 })
  }

  const extractInvoiceTotal = (items: unknown[]) => {
    return items.reduce<number>((sum, entry) => {
      if (!entry || typeof entry !== 'object') {
        return sum
      }
      const amount =
        (typeof (entry as { amount?: unknown }).amount === 'number' && (entry as { amount: number }).amount) ||
        (typeof (entry as { amount?: unknown }).amount === 'string' && Number.parseFloat((entry as { amount: string }).amount)) ||
        (typeof (entry as { total?: unknown }).total === 'number' && (entry as { total: number }).total) ||
        (typeof (entry as { total?: unknown }).total === 'string' && Number.parseFloat((entry as { total: string }).total)) ||
        0
      return Number.isFinite(amount) ? sum + amount : sum
    }, 0)
  }

  const normalizeItem = (item: Record<string, unknown>) => {
    const invoiceItems = Array.isArray(item.invoice) ? item.invoice : []
    const explicitPrice =
      (typeof item.price === 'number' && item.price) ||
      (typeof item.price === 'string' && Number.parseFloat(item.price)) ||
      0
    const invoiceTotal = extractInvoiceTotal(invoiceItems)
    const price = explicitPrice || invoiceTotal
    
    // Build booking object with all required fields
    const booking: Record<string, unknown> = {
      propertyId: Number(propertyId),
      roomId: Number(roomId),
      arrival: item.arrival,
      departure: item.departure,
      firstName: item.firstName,
      lastName: item.lastName,
      status: item.status ?? 'confirmed',
      invoice: invoiceItems,
      ...(price ? { price } : {}),
    }
    
    // Add optional fields if provided
    if (item.mobile) booking.mobile = item.mobile
    if (item.phone) booking.phone = item.phone
    if (item.email) booking.email = item.email
    if (item.numAdult) booking.numAdult = item.numAdult
    if (item.numChild) booking.numChild = item.numChild
    if (item.notes) booking.notes = item.notes
    if (item.address) booking.address = item.address
    if (item.city) booking.city = item.city
    if (item.postcode) booking.postcode = item.postcode
    if (item.country) booking.country = item.country
    
    return booking
  }

  const normalizedPayload = Array.isArray(payload)
    ? payload.map((item) => normalizeItem(item as Record<string, unknown>))
    : [normalizeItem(payload as Record<string, unknown>)]

  console.log('Beds24 booking payload', normalizedPayload)

  const response = await fetchWithTokenRefresh(`${getBaseUrl()}/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(normalizedPayload),
  })

  if (!response.ok) {
    const details = await response.text()
    return NextResponse.json(
      { error: 'Beds24 request failed', status: response.status, details },
      { status: 502 }
    )
  }

  const data = await response.json()
  
  console.log('✅ Beds24 response:', JSON.stringify(data, null, 2))
  
  // Send WhatsApp notifications for direct bookings
  // (Beds24 doesn't send webhooks for API-created bookings)
  if (!sendWhatsApp) {
    console.log('⏭️  Skipping WhatsApp - disabled by user')
    return NextResponse.json(data)
  }
  
  try {
    console.log('📝 Starting WhatsApp/Supabase process...')
    
    const firstBooking = normalizedPayload[0]
    const guestName = `${String(firstBooking.firstName || '')} ${String(firstBooking.lastName || '')}`.trim()
    const guestPhone = String(firstBooking.mobile || firstBooking.phone || '')
    const checkInDate = String(firstBooking.arrival || '')
    const checkOutDate = String(firstBooking.departure || '')
    const numAdult = Number(firstBooking.numAdult) || 1
    
    console.log(`👤 Guest: ${guestName}, Phone: ${guestPhone}`)
    
    // Get booking ID from Beds24 response
    const bookingId = Array.isArray(data) && data[0]?.new?.id 
      ? String(data[0].new.id)
      : (Array.isArray(data) && data[0]?.bookingId ? String(data[0].bookingId) : 'N/A')
    
    console.log(`🔖 Booking ID: ${bookingId}`)
    
    // Save to Supabase notifications_log
    console.log('💾 Attempting to save to Supabase...')
    const supabase = createServerClient()
    const { data: logData, error: logError } = await supabase
      .from('notifications_log')
      .insert({
        guest_name: guestName,
        phone: guestPhone,
        check_in_date: checkInDate,
        raw_payload: {
          source: 'dashboard',
          booking: firstBooking,
          beds24Response: data,
        },
        status: 'received',
        created_at: new Date().toISOString(),
      })
      .select()
    
    if (logError) {
      console.log('❌ SUPABASE ERROR:', JSON.stringify(logError, null, 2))
      console.error('❌ Failed to save to notifications_log:', logError)
    } else {
      console.log('✅ Saved to Supabase! Record ID:', logData?.[0]?.id)
    }
    
    const recordId = logData?.[0]?.id
    
    // Get owner info for room name and phone
    const ownerEmail = session?.user?.email
    console.log(`👤 Owner email: ${ownerEmail}`)
    let ownerInfo = { phoneNumber: null as string | null, roomName: null as string | null }
    
    if (ownerEmail) {
      try {
        const user = await getUserByEmail(ownerEmail)
        if (user) {
          ownerInfo = {
            phoneNumber: user.phoneNumber || null,
            roomName: user.displayName || null,
          }
          console.log(`📞 Owner info: phone=${ownerInfo.phoneNumber}, name=${ownerInfo.roomName}`)
        } else {
          console.log('⚠️  Owner user not found')
        }
      } catch (error) {
        console.log('❌ ERROR getting owner info:', error)
        console.error('❌ Error getting owner info:', error)
      }
    } else {
      console.log('⚠️  No owner email in session')
    }
    
    // Send WhatsApp to guest
    let whatsappResult: { success: boolean; provider: string; error?: string } = {
      success: false,
      provider: 'none',
      error: 'No phone number',
    }
    
    if (guestPhone) {
      const propertyName = ownerInfo.roomName || 'Mountain View'
      whatsappResult = await sendWhatsAppMessage({
        to: guestPhone,
        message: `שלום ${guestName}! 🏔️\n\nקיבלנו את הזמנתך ב-${propertyName}.\n📅 תאריך כניסה: ${checkInDate}\n\nנשמח לארח אותך! 🎉`,
      })
      
      console.log(`📱 Guest WhatsApp (${guestPhone}):`, whatsappResult.success ? '✅ Sent' : `❌ Failed - ${whatsappResult.error}`)
    } else {
      console.warn('⚠️  Skipping guest WhatsApp - no phone number')
    }
    
    // Send WhatsApp to owner
    let ownerNotificationResult = null
    
    if (ownerInfo.phoneNumber) {
      ownerNotificationResult = await sendWhatsAppMessage({
        to: ownerInfo.phoneNumber,
        message: `🔔 הזמנה חדשה!\n\n👤 אורח: ${guestName}\n📱 טלפון: ${guestPhone || 'לא צוין'}\n📅 כניסה: ${checkInDate}${
          checkOutDate ? `\n📅 יציאה: ${checkOutDate}` : ''
        }${ownerInfo.roomName ? `\n🏠 יחידה: ${ownerInfo.roomName}` : ''}${
          numAdult ? `\n👥 מספר אורחים: ${numAdult}` : ''
        }\n🔖 מספר הזמנה: ${bookingId}`,
      })
      
      console.log(`📱 Owner WhatsApp (${ownerInfo.phoneNumber}):`, ownerNotificationResult.success ? '✅ Sent' : `❌ Failed - ${ownerNotificationResult.error}`)
    } else {
      console.warn('⚠️  Skipping owner WhatsApp - phone not configured in profile')
    }
    
    // Update database with WhatsApp status
    if (recordId) {
      const status = whatsappResult.success ? 'sent' : 'failed'
      await supabase
        .from('notifications_log')
        .update({
          status,
          whatsapp_sent_at: whatsappResult.success ? new Date().toISOString() : null,
          whatsapp_error: whatsappResult.error || null,
        })
        .eq('id', recordId)
    }
    
  } catch (whatsappError) {
    // Don't fail the booking creation if WhatsApp fails
    console.log('❌ CAUGHT ERROR in WhatsApp/Supabase block:', whatsappError)
    console.error('❌ Error sending WhatsApp:', whatsappError)
  }
  
  console.log('🏁 Finished booking creation process')
  
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ data, debugPayload: normalizedPayload })
  }
  return NextResponse.json(data)
}
