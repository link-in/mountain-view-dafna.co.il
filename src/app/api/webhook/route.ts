import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

// Force dynamic rendering for webhooks
export const dynamic = 'force-dynamic'

interface Beds24WebhookPayload {
  guestName: string
  phone: string
  checkInDate: string
  propertyId?: string
  roomId?: string
  // Add more fields as needed from Beds24 webhook
  [key: string]: any
}

interface OwnerInfo {
  phoneNumber: string | null
  roomName: string | null
}

async function getOwnerInfo(payload: Beds24WebhookPayload): Promise<OwnerInfo> {
  try {
    // First priority: Try to find user by propertyId or roomId from payload
    const supabase = createServerClient()
    
    let query = supabase.from('users').select('display_name, phone_number')
    
    if (payload.propertyId) {
      query = query.eq('property_id', payload.propertyId)
    } else if (payload.roomId) {
      query = query.eq('room_id', payload.roomId)
    } else {
      // No property or room ID provided, try env variable
      const envPhone = process.env.OWNER_PHONE_NUMBER
      if (envPhone && envPhone.trim()) {
        console.log('✅ Using owner phone from env variable')
        return {
          phoneNumber: envPhone,
          roomName: payload.roomName || null,
        }
      }
      
      console.warn('⚠️  No propertyId or roomId in payload')
      return { phoneNumber: null, roomName: null }
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('⚠️  No user found for property/room:', {
          propertyId: payload.propertyId,
          roomId: payload.roomId,
        })
      } else {
        console.error('❌ Error querying users:', error)
      }
      
      // Fallback: Try environment variable
      const envPhone = process.env.OWNER_PHONE_NUMBER
      if (envPhone && envPhone.trim()) {
        console.log('✅ Using owner phone from env variable (fallback)')
        return {
          phoneNumber: envPhone,
          roomName: payload.roomName || null,
        }
      }
      
      return { phoneNumber: null, roomName: null }
    }

    if (data && data.phone_number && data.phone_number.trim()) {
      console.log('✅ Found owner from Supabase:', data.display_name)
      return {
        phoneNumber: data.phone_number,
        roomName: data.display_name,
      }
    }

    console.warn('⚠️  User found but no phone number configured')
    return { phoneNumber: null, roomName: data?.display_name || null }
  } catch (error) {
    console.error('❌ Error getting owner info:', error)
    return { phoneNumber: null, roomName: null }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON payload from Beds24
    const payload: Beds24WebhookPayload = await request.json()

    // Log the received data to console for debugging
    console.log('📥 Received Beds24 Webhook:')
    console.log('Guest Name:', payload.guestName)
    console.log('Phone:', payload.phone)
    console.log('Check-in Date:', payload.checkInDate)
    console.log('Full payload:', JSON.stringify(payload, null, 2))

    // Save to Supabase notifications_log table
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notifications_log')
      .insert({
        guest_name: payload.guestName,
        phone: payload.phone,
        check_in_date: payload.checkInDate,
        raw_payload: payload,
        status: 'received',
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('❌ Error saving to Supabase:', error)
      // Still return 200 to Beds24 so they don't retry
      return NextResponse.json(
        { 
          success: false, 
          message: 'Webhook received but failed to save to database',
          error: error.message 
        },
        { status: 200 }
      )
    }

    console.log('✅ Webhook saved to database:', data)

    const recordId = data[0]?.id

    // Get owner info first (for both guest and owner messages)
    const ownerInfo = await getOwnerInfo(payload)
    
    // Send WhatsApp message to guest
    const propertyName = ownerInfo.roomName || 'Mountain View' // Fallback to default if not found
    const whatsappResult = await sendWhatsAppMessage({
      to: payload.phone,
      message: `שלום ${payload.guestName}! 🏔️\n\nקיבלנו את הזמנתך ב-${propertyName}.\n📅 תאריך כניסה: ${payload.checkInDate}\n\nנשמח לארח אותך! 🎉`,
    })

    // Send notification to property owner
    let ownerNotificationResult = null
    
    if (ownerInfo.phoneNumber) {
      ownerNotificationResult = await sendWhatsAppMessage({
        to: ownerInfo.phoneNumber,
        message: `🔔 הזמנה חדשה!\n\n👤 אורח: ${payload.guestName}\n📱 טלפון: ${payload.phone}\n📅 כניסה: ${payload.checkInDate}${payload.checkOutDate ? `\n📅 יציאה: ${payload.checkOutDate}` : ''}${ownerInfo.roomName ? `\n🏠 יחידה: ${ownerInfo.roomName}` : ''}${payload.bookingId ? `\n🔖 מספר הזמנה: ${payload.bookingId}` : ''}`,
      })
      
      if (ownerNotificationResult.success) {
        console.log('✅ Owner notification sent successfully')
      } else {
        console.error('❌ Failed to send owner notification:', ownerNotificationResult.error)
      }
    }

    // Update database with WhatsApp status
    if (recordId) {
      await supabase
        .from('notifications_log')
        .update({
          status: whatsappResult.success ? 'sent' : 'failed',
          whatsapp_sent_at: whatsappResult.success ? new Date().toISOString() : null,
          whatsapp_error: whatsappResult.error || null,
        })
        .eq('id', recordId)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Webhook received and processed successfully',
        data,
        whatsapp: {
          guest: {
            sent: whatsappResult.success,
            provider: whatsappResult.provider,
            error: whatsappResult.error,
          },
          owner: ownerNotificationResult ? {
            sent: ownerNotificationResult.success,
            provider: ownerNotificationResult.provider,
            error: ownerNotificationResult.error,
          } : {
            sent: false,
            message: 'Owner phone not configured (set OWNER_PHONE_NUMBER in .env)'
          }
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    
    // Return 200 even on error to prevent Beds24 from retrying
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 200 }
    )
  }
}

// Optional: Add GET handler for testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Beds24 Webhook Endpoint',
      status: 'active',
      endpoint: '/api/webhook',
      method: 'POST'
    },
    { status: 200 }
  )
}
