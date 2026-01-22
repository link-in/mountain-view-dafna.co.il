import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import fs from 'fs'
import path from 'path'
import type { User } from '@/lib/auth/types'

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

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'users.json')

function getOwnerPhoneNumber(payload: Beds24WebhookPayload): string | null {
  try {
    // First, try environment variable (backward compatibility)
    const envPhone = process.env.OWNER_PHONE_NUMBER
    if (envPhone) {
      return envPhone
    }

    // Then, try to find user by propertyId or roomId from payload
    if (!fs.existsSync(USERS_FILE_PATH)) {
      console.warn('⚠️  Users file not found')
      return null
    }

    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8')
    const users: User[] = JSON.parse(fileContent)

    // Find user by propertyId or roomId
    const user = users.find(
      (u) =>
        (payload.propertyId && u.propertyId === payload.propertyId) ||
        (payload.roomId && u.roomId === payload.roomId)
    )

    if (user && user.phoneNumber) {
      return user.phoneNumber
    }

    console.warn('⚠️  No phone number found for property/room:', {
      propertyId: payload.propertyId,
      roomId: payload.roomId,
    })
    return null
  } catch (error) {
    console.error('❌ Error getting owner phone:', error)
    return null
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

    // Send WhatsApp message to guest
    const whatsappResult = await sendWhatsAppMessage({
      to: payload.phone,
      message: `שלום ${payload.guestName}! 🏔️\n\nקיבלנו את הזמנתך ב-Mountain View.\n📅 תאריך כניסה: ${payload.checkInDate}\n\nנשמח לארח אותך! 🎉`,
    })

    // Send notification to property owner
    const ownerPhone = getOwnerPhoneNumber(payload)
    let ownerNotificationResult = null
    
    if (ownerPhone) {
      ownerNotificationResult = await sendWhatsAppMessage({
        to: ownerPhone,
        message: `🔔 הזמנה חדשה!\n\n👤 אורח: ${payload.guestName}\n📱 טלפון: ${payload.phone}\n📅 כניסה: ${payload.checkInDate}${payload.checkOutDate ? `\n📅 יציאה: ${payload.checkOutDate}` : ''}${payload.roomName ? `\n🏠 יחידה: ${payload.roomName}` : ''}${payload.bookingId ? `\n🔖 מספר הזמנה: ${payload.bookingId}` : ''}`,
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
