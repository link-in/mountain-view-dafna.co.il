import { NextResponse } from 'next/server'
import { getLowProfileResult } from '@/lib/cardcom/client'
import { processSuccessfulPayment } from '@/lib/invoice4u/client'
import { logPaymentEvent } from '@/lib/payment-audit/logPaymentEvent'
import { createAdminClient } from '@/lib/supabase/server'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'
const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL
const WEBHOOK_VERSION = 'invoice4u-v2'

/**
 * POST /api/cardcom/webhook
 *
 * Unauthenticated webhook from Cardcom — fires when a payment session completes.
 * Validation is performed by calling GetLpResult (server-to-server), not by trusting the payload.
 *
 * Per spec:
 * - Retry GetLpResult once on HTTP error
 * - 5-second timeout per attempt
 * - Return HTTP 500 if Cardcom call fails after retry
 * - Idempotent: skip if TranzactionId already recorded
 */
export async function POST(request: Request) {
  let lowProfileId: string
  let webhookBody: Record<string, unknown> = {}

  try {
    const body = await request.json()
    webhookBody = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
    // קארדקום V11 שולח LowProfileId בגוף ה-webhook
    lowProfileId = body?.LowProfileId ?? body?.lowprofilecode ?? body?.lowProfileId ?? ''

    console.log('📩 [Cardcom Webhook] Received:', {
      lowProfileId,
      responseCode: body?.ResponseCode,
      operation: body?.Operation,
      version: WEBHOOK_VERSION,
    })
  } catch {
    console.warn('⚠️ [Cardcom Webhook] Could not parse body')
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!lowProfileId) {
    return NextResponse.json({ error: 'Missing LowProfileId' }, { status: 400 })
  }

  const supabase = createAdminClient()

  await logPaymentEvent({
    lowProfileId,
    stage: 'cardcom_webhook_received',
    status: 'info',
    message: 'Cardcom webhook received',
    data: {
      responseCode: String(webhookBody.ResponseCode ?? ''),
      operation: String(webhookBody.Operation ?? ''),
      terminalNumber: String(webhookBody.terminalnumber ?? webhookBody.TerminalNumber ?? ''),
      internalDealNumber: String(webhookBody.internalDealNumber ?? ''),
      version: WEBHOOK_VERSION,
    },
    supabase,
  })

  // Locate the pending booking
  const { data: pending, error: fetchError } = await supabase
    .from('pending_bookings')
    .select('*')
    .eq('cardcom_low_profile_id', lowProfileId)
    .single()

  if (fetchError || !pending) {
    console.error('❌ [Cardcom Webhook] Booking not found for LowProfileId:', lowProfileId)
    await logPaymentEvent({
      lowProfileId,
      stage: 'pending_booking_not_found',
      status: 'error',
      message: fetchError?.message ?? 'Booking not found for Cardcom LowProfileId',
      data: { version: WEBHOOK_VERSION },
      supabase,
    })
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Idempotency: already processed
  if (pending.cardcom_tranzaction_id) {
    console.log('ℹ️ [Cardcom Webhook] Already processed, skipping:', lowProfileId)
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'cardcom_webhook_already_processed',
      status: 'warning',
      message: 'Cardcom webhook skipped because transaction was already recorded',
      data: {
        cardcomTranzactionId: String(pending.cardcom_tranzaction_id),
        status: String(pending.status ?? ''),
      },
      supabase,
    })
    return NextResponse.json({ received: true }, { status: 200 })
  }

  // Call Cardcom GetLpResult to independently validate (with 1 retry, 5s timeout)
  let lpResult
  try {
    lpResult = await getLowProfileResult(lowProfileId, 1)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ [Cardcom Webhook] GetLpResult failed after retry:', msg)
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'cardcom_validation_failed',
      status: 'error',
      message: msg,
      supabase,
    })
    return NextResponse.json({ error: `Cardcom validation failed: ${msg}` }, { status: 500 })
  }

  // Build the Supabase update payload with all CardCom columns
  const cardcomUpdate: Record<string, unknown> = {
    cardcom_response_code: String(lpResult.ResponseCode),
    cardcom_description: lpResult.Description,
    cardcom_document_type: lpResult.DocumentInfo?.DocumentType ?? null,
    cardcom_document_number: lpResult.DocumentInfo?.DocumentNumber ?? null,
    cardcom_token: lpResult.TokenInfo?.Token ?? null,
    cardcom_token_card_year: lpResult.TokenInfo?.CardYear ?? null,
    cardcom_token_card_month: lpResult.TokenInfo?.CardMonth ?? null,
    cardcom_token_approval_number: lpResult.TokenInfo?.TokenApprovalNumber ?? null,
    cardcom_token_card_owner_identity_number: lpResult.TokenInfo?.CardOwnerIdentityNumber ?? null,
  }

  // ── Payment failed ─────────────────────────────────────────────────────────
  if (lpResult.ResponseCode !== 0) {
    console.error('❌ [Cardcom Webhook] Payment failed:', lpResult.ResponseCode, lpResult.Description)
    await supabase
      .from('pending_bookings')
      .update({ ...cardcomUpdate, status: 'failed' })
      .eq('cardcom_low_profile_id', lowProfileId)

    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'cardcom_payment_failed',
      status: 'error',
      message: lpResult.Description ?? 'Cardcom payment failed',
      data: {
        responseCode: lpResult.ResponseCode,
        operation: lpResult.Operation ?? '',
      },
      supabase,
    })

    return NextResponse.json({ received: true }, { status: 200 })
  }

  // ── ChargeOnly: mark paid ──────────────────────────────────────────────────
  if (lpResult.Operation === 'ChargeOnly') {
    cardcomUpdate.cardcom_tranzaction_id = lpResult.TranzactionId
    cardcomUpdate.status = 'paid'
  }

  // ── CreateTokenOnly: mark pending charge ──────────────────────────────────
  if (lpResult.Operation === 'CreateTokenOnly') {
    cardcomUpdate.cardcom_tranzaction_id = 0
    cardcomUpdate.status = 'pending_charge'
  }

  await supabase
    .from('pending_bookings')
    .update(cardcomUpdate)
    .eq('cardcom_low_profile_id', lowProfileId)

  await logPaymentEvent({
    uniquePaymentId: pending.unique_payment_id,
    lowProfileId,
    stage: 'cardcom_verified',
    status: 'success',
    message: 'Cardcom payment verified with GetLpResult',
    data: {
      responseCode: lpResult.ResponseCode,
      operation: lpResult.Operation ?? '',
      tranzactionId: String(lpResult.TranzactionId ?? ''),
      amount: lpResult.TranzactionInfo?.Sum ?? null,
      cardName: lpResult.TranzactionInfo?.CardName ?? '',
      last4Digits: lpResult.TranzactionInfo?.Last4Digits ?? '',
    },
    supabase,
  })

  // Only create Beds24 booking for completed charge (not token-only)
  if (lpResult.Operation !== 'ChargeOnly') {
    console.log('ℹ️ [Cardcom Webhook] Token-only operation — skipping Beds24 booking creation')
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'cardcom_token_only',
      status: 'info',
      message: 'Token-only operation; skipping Invoice4U and Beds24 booking creation',
      data: { operation: lpResult.Operation ?? '' },
      supabase,
    })
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const guest = pending.guest_data as Record<string, unknown>
  const propertyId = process.env.BEDS24_PROPERTY_ID
  const roomId = process.env.BEDS24_ROOM_ID

  if (!propertyId || !roomId) {
    console.error('❌ [Cardcom Webhook] Missing Beds24 configuration')
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'beds24_configuration_missing',
      status: 'error',
      message: 'Missing Beds24 property or room configuration',
      data: {
        hasPropertyId: Boolean(propertyId),
        hasRoomId: Boolean(roomId),
      },
      supabase,
    })
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const txId = lpResult.TranzactionId ?? 'N/A'
  const authNum = lpResult.TranzactionInfo?.AuthNum ?? ''
  const amountShekels = pending.amount_agorot / 100

  if (process.env.INVOICE4U_SKIP === 'true') {
    console.log('⏭️  [Invoice4U] Skipped — INVOICE4U_SKIP=true (test/dev mode)')
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'invoice4u_skipped',
      status: 'info',
      message: 'Invoice4U skipped (INVOICE4U_SKIP=true)',
      data: { amount: amountShekels },
      supabase,
    })
  } else {
  console.log('🧾 [Invoice4U] Starting document creation:', {
    lowProfileId,
    amount: amountShekels,
    transactionId: txId,
    authNum,
    hasApiKey: Boolean(process.env.INVOICE4U_API_KEY),
  })

  await logPaymentEvent({
    uniquePaymentId: pending.unique_payment_id,
    lowProfileId,
    stage: 'invoice4u_started',
    status: 'info',
    message: 'Starting Invoice4U tax invoice receipt creation',
    data: {
      amount: amountShekels,
      transactionId: String(txId),
      authNum,
      hasApiKey: Boolean(process.env.INVOICE4U_API_KEY),
      guestEmail: String(guest.email || ''),
    },
    supabase,
  })

  try {
    const invoiceResult = await processSuccessfulPayment({
      Sum: amountShekels,
      ConfirmationNo: authNum || txId,
      TransactionId: txId,
      L4Digit: lpResult.TranzactionInfo?.Last4Digits,
      CardType: lpResult.TranzactionInfo?.CardName,
      CustomerName: `${String(guest.firstName || '')} ${String(guest.lastName || '')}`.trim(),
      Email: String(guest.email || ''),
      TranzactionInfo: lpResult.TranzactionInfo ?? undefined,
    })

    console.log('✅ [Invoice4U] Document created:', {
      documentId: invoiceResult.documentId,
      pdfUrl: invoiceResult.pdfUrl,
    })
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'invoice4u_success',
      status: 'success',
      message: 'Invoice4U document created',
      data: {
        documentId: invoiceResult.documentId ?? '',
        documentNumber: invoiceResult.documentNumber ?? '',
        pdfUrl: invoiceResult.pdfUrl ?? '',
        mailsAttached: invoiceResult.mailsAttached ?? '',
        emailSent: Boolean(invoiceResult.mailsAttached),
      },
      supabase,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ [Invoice4U] Failed to create tax invoice receipt:', message)
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'invoice4u_failed',
      status: 'error',
      message,
      data: {
        amount: amountShekels,
        transactionId: String(txId),
        authNum,
      },
      supabase,
    })
  }
  } // end INVOICE4U_SKIP else

  const beds24Booking = {
    propertyId: Number(propertyId),
    roomId: Number(roomId),
    arrival: guest.checkIn,
    departure: guest.checkOut,
    firstName: guest.firstName,
    lastName: guest.lastName,
    email: guest.email,
    mobile: guest.phone || '',
    numAdult: Number(guest.numAdult) || 1,
    numChild: Number(guest.numChild) || 0,
    status: 1, // 1 = Confirmed ב-Beds24 V2
    referer: 'website',
    price: amountShekels,
    notes: [
      guest.notes || '',
      `תשלום קארדקום: txId=${txId}, authNum=${authNum}, סכום=₪${amountShekels}`,
    ]
      .filter(Boolean)
      .join(' | '),
    invoice: [
      {
        type: 'charge',
        description: `לינה ${guest.checkIn} — ${guest.checkOut}`,
        amount: amountShekels,
        currency: 'ILS',
        isPaid: 1,
      },
    ],
  }

  try {
    const response = await fetchWithTokenRefresh(`${getBaseUrl()}/bookings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify([beds24Booking]),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('❌ [Cardcom Webhook] Beds24 booking failed after payment:', details)
      await supabase
        .from('pending_bookings')
        .update({ status: 'paid_beds24_error' })
        .eq('cardcom_low_profile_id', lowProfileId)
      await logPaymentEvent({
        uniquePaymentId: pending.unique_payment_id,
        lowProfileId,
        stage: 'beds24_booking_failed',
        status: 'error',
        message: `Beds24 HTTP error ${response.status}`,
        data: { details },
        supabase,
      })
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const beds24Data = await response.json()
    const bookingId =
      Array.isArray(beds24Data) && beds24Data[0]?.new?.id
        ? String(beds24Data[0].new.id)
        : Array.isArray(beds24Data) && beds24Data[0]?.bookingId
          ? String(beds24Data[0].bookingId)
          : 'N/A'

    console.log('✅ [Cardcom Webhook] Beds24 booking created:', bookingId)
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'beds24_booking_created',
      status: 'success',
      message: 'Beds24 booking created after successful payment',
      data: {
        bookingId,
        amount: amountShekels,
        checkIn: String(guest.checkIn || ''),
        checkOut: String(guest.checkOut || ''),
      },
      supabase,
    })

    await supabase
      .from('pending_bookings')
      .update({ beds24_booking_id: bookingId })
      .eq('cardcom_low_profile_id', lowProfileId)

    sendWhatsAppNotifications(guest, bookingId, pending.amount_agorot).catch((err) => {
      console.error('❌ [Cardcom Webhook] WhatsApp error:', err)
    })
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'whatsapp_dispatch_queued',
      status: 'info',
      message: 'WhatsApp notifications queued after Beds24 booking creation',
      data: { bookingId },
      supabase,
    })
  } catch (err) {
    console.error('❌ [Cardcom Webhook] Beds24 error:', err)
    await logPaymentEvent({
      uniquePaymentId: pending.unique_payment_id,
      lowProfileId,
      stage: 'beds24_unexpected_error',
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
      supabase,
    })
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

async function sendWhatsAppNotifications(
  guest: Record<string, unknown>,
  bookingId: string,
  amountAgorot: number
) {
  const guestName = `${String(guest.firstName || '')} ${String(guest.lastName || '')}`.trim()
  const rawPhone = String(guest.phone || '')
  // המרה לפורמט בינלאומי: 05X → 97Z5X
  const guestPhone = rawPhone.startsWith('0')
    ? `972${rawPhone.slice(1)}`
    : rawPhone
  const guestEmail = String(guest.email || '')
  const checkIn = String(guest.checkIn || '')
  const checkOut = String(guest.checkOut || '')
  const numAdult = Number(guest.numAdult) || 1
  const numChild = Number(guest.numChild) || 0
  const amountShekels = amountAgorot / 100

  if (guestPhone) {
    await sendWhatsAppMessage({
      to: guestPhone,
      message: `שלום ${guestName}! 🏔️\n\nהזמנתך בנוף הרים בדפנה אושרה ✅\n💳 תשלום של ₪${amountShekels.toLocaleString()} בוצע בהצלחה!\n📅 כניסה: ${checkIn}\n📅 יציאה: ${checkOut}\n👥 מבוגרים: ${numAdult}${numChild > 0 ? `\n👶 ילדים: ${numChild}` : ''}\n🔖 מספר הזמנה: ${bookingId}\n\nנשמח לארח אותך! 🎉`,
    })
  }

  const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER
  if (ownerPhone) {
    await sendWhatsAppMessage({
      to: ownerPhone,
      message: `💳 הזמנה + תשלום חדשים!\n\n👤 אורח: ${guestName}\n📱 טלפון: ${guestPhone || 'לא צוין'}\n📧 אימייל: ${guestEmail}\n💰 תשלום: ₪${amountShekels.toLocaleString()}\n📅 כניסה: ${checkIn}\n📅 יציאה: ${checkOut}\n👥 מבוגרים: ${numAdult}${numChild > 0 ? `\n👶 ילדים: ${numChild}` : ''}\n🔖 מספר הזמנה: ${bookingId}`,
    })
  }
}
