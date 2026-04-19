import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/public/payment/verify
 *
 * Called from the /payment/success page after Cardcom redirects the guest.
 * Cardcom appends ?LowProfileId=<guid> to the SuccessRedirectUrl.
 *
 * The actual payment validation and Beds24 booking are handled by the webhook at
 * /api/cardcom/webhook (fires server-to-server before/alongside this redirect).
 *
 * This endpoint reads the current booking state from Supabase and returns it.
 * It waits briefly and retries a few times to handle the race where the
 * webhook hasn't completed yet when the guest's browser arrives here.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // קארדקום V11 שולח lowprofilecode בריידיירקט (לא LowProfileId)
  const lowProfileId =
    searchParams.get('lowprofilecode') ??
    searchParams.get('LowProfileId') ??
    searchParams.get('lowprofileid') ??
    ''
  const isMockBypass = searchParams.get('mock') === 'true'
  const isMockMode = process.env.CARDCOM_MOCK_MODE === 'true'

  if (!lowProfileId) {
    return NextResponse.json({ error: 'Missing LowProfileId parameter' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Poll up to ~6 seconds for webhook to complete (webhook fires in parallel)
  let pending = null
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, error } = await supabase
      .from('pending_bookings')
      .select('*')
      .eq('cardcom_low_profile_id', lowProfileId)
      .single()

    if (error || !data) {
      if (attempt === 5) {
        console.error('❌ Booking not found for LowProfileId:', lowProfileId, error)
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }
      await new Promise((r) => setTimeout(r, 1000))
      continue
    }

    // Booking has been processed by the webhook
    if (data.status === 'paid' || data.status === 'failed' || data.status === 'pending_charge') {
      pending = data
      break
    }

    // Mock mode: treat as paid immediately without waiting
    if (isMockMode && isMockBypass) {
      pending = data
      break
    }

    if (attempt < 5) {
      await new Promise((r) => setTimeout(r, 1000))
    } else {
      pending = data
    }
  }

  if (!pending) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Payment failed
  if (pending.status === 'failed') {
    return NextResponse.json({ error: 'Payment failed or was declined' }, { status: 402 })
  }

  // Already confirmed (idempotent re-visit)
  if (pending.status === 'paid') {
    const guest = pending.guest_data as Record<string, unknown>
    return NextResponse.json({
      success: true,
      bookingId: pending.beds24_booking_id ?? 'N/A',
      guestName: `${String(guest.firstName ?? '')} ${String(guest.lastName ?? '')}`.trim(),
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      amountPaid: pending.amount_agorot / 100,
      message: 'ההזמנה אושרה ותשלום בוצע בהצלחה!',
    })
  }

  // Token-only — waiting for deferred charge
  if (pending.status === 'pending_charge') {
    const guest = pending.guest_data as Record<string, unknown>
    return NextResponse.json({
      success: true,
      pendingCharge: true,
      guestName: `${String(guest.firstName ?? '')} ${String(guest.lastName ?? '')}`.trim(),
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      message: 'הפרטים נשמרו. הכרטיס יחויב בנפרד.',
    })
  }

  // Mock mode bypass — webhook won't fire in local dev
  if (isMockMode && isMockBypass) {
    const guest = pending.guest_data as Record<string, unknown>
    return NextResponse.json({
      success: true,
      bookingId: 'MOCK',
      guestName: `${String(guest.firstName ?? '')} ${String(guest.lastName ?? '')}`.trim(),
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      amountPaid: pending.amount_agorot / 100,
      message: '🧪 [MOCK] ההזמנה אושרה בסביבת פיתוח',
    })
  }

  // Still pending after retries — webhook likely delayed
  return NextResponse.json(
    { error: 'Payment processing — please wait a moment and refresh' },
    { status: 202 }
  )
}
