import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createLowProfile, type CardcomOperation } from '@/lib/cardcom/client'
import { logPaymentEvent } from '@/lib/payment-audit/logPaymentEvent'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mountain-view-dafna.co.il'

/**
 * Mock mode — רק כשמוגדר CARDCOM_MOCK_MODE=true (פיתוח מקומי בלבד).
 * ?test=<token> כבר לא מפעיל mock — הוא שולח תשלום אמיתי של ₪1 לקארדקום.
 */
function isMockMode(): boolean {
  return process.env.CARDCOM_MOCK_MODE === 'true'
}

/**
 * בדיקה אם הטוקן שנשלח תואם ל-CARDCOM_TEST_TOKEN.
 * אם כן — המחיר יורד ל-₪1 אך התשלום נשלח לקארדקום האמיתי.
 */
function isValidTestToken(submittedToken?: string): boolean {
  const expected = process.env.CARDCOM_TEST_TOKEN
  return !!expected && !!submittedToken && submittedToken === expected
}

const getOperation = (): CardcomOperation =>
  (process.env.CARDCOM_OPERATION as CardcomOperation | undefined) ?? 'ChargeOnly'

function buildMockCheckoutUrl(
  siteUrl: string,
  uniqueId: string,
  totalAmount: number,
  mockLowProfileId: string
): string {
  const successParams = new URLSearchParams({
    LowProfileId: mockLowProfileId,
    uniqueID: uniqueId,
    mock: 'true',
  })
  const checkoutParams = new URLSearchParams({
    uniqueID: uniqueId,
    amount: String(totalAmount),
    successUrl: `${siteUrl}/payment/success?${successParams.toString()}`,
    cancelUrl: `${siteUrl}/payment/cancel`,
    errorUrl: `${siteUrl}/payment/error`,
  })
  return `${siteUrl}/payment/mock-checkout?${checkoutParams.toString()}`
}

/**
 * POST /api/public/payment/init
 *
 * Accepts guest booking details + calculated price.
 * Saves a pending booking to Supabase, requests a Cardcom LowProfile payment page URL,
 * and returns that URL to the frontend for redirect.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const data = body as Record<string, unknown>

  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'checkIn', 'checkOut', 'totalPrice']
  const missing = requiredFields.filter((f) => !data[f])
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 })
  }

  const totalPrice = Number(data.totalPrice)
  if (isNaN(totalPrice) || totalPrice <= 0) {
    return NextResponse.json({ error: 'Invalid totalPrice' }, { status: 400 })
  }

  const uniqueId = randomUUID()
  const siteUrl = getSiteUrl()
  const operation = getOperation()
  const guestName = `${String(data.firstName)} ${String(data.lastName)}`.trim()
  const checkIn = String(data.checkIn)
  const checkOut = String(data.checkOut)

  // Save pending booking to Supabase before calling Cardcom
  try {
    const supabase = createAdminClient()
    const { error: insertError } = await supabase.from('pending_bookings').insert({
      unique_payment_id: uniqueId,
      guest_data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        checkIn,
        checkOut,
        numAdult: Number(data.numAdult) || 1,
        numChild: Number(data.numChild) || 0,
        notes: data.notes || '',
      },
      amount_agorot: Math.round(totalPrice * 100),
      status: 'pending',
      cardcom_operation: operation,
    })

    if (insertError) {
      console.error('❌ Failed to save pending booking:', insertError)
      await logPaymentEvent({
        uniquePaymentId: uniqueId,
        stage: 'pending_booking_create_failed',
        status: 'error',
        message: insertError.message,
        data: {
          guestName,
          email: String(data.email),
          checkIn,
          checkOut,
          totalPrice,
          operation,
        },
        supabase,
      })
      return NextResponse.json({ error: 'Failed to save booking data' }, { status: 500 })
    }

    await logPaymentEvent({
      uniquePaymentId: uniqueId,
      stage: 'pending_booking_created',
      status: 'success',
      message: 'Pending booking saved before Cardcom redirect',
      data: {
        guestName,
        email: String(data.email),
        phone: String(data.phone),
        checkIn,
        checkOut,
        numAdult: Number(data.numAdult) || 1,
        numChild: Number(data.numChild) || 0,
        totalPrice,
        operation,
      },
      supabase,
    })
  } catch (err) {
    console.error('❌ Supabase error:', err)
    await logPaymentEvent({
      uniquePaymentId: uniqueId,
      stage: 'pending_booking_database_error',
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
      data: {
        guestName,
        email: String(data.email),
        checkIn,
        checkOut,
        totalPrice,
        operation,
      },
    })
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // ── MOCK MODE (פיתוח מקומי בלבד) ──────────────────────────────────────────
  const submittedTestToken = typeof data.testToken === 'string' ? data.testToken : undefined
  if (isMockMode()) {
    const mockLowProfileId = `mock-lp-${Date.now()}`

    // Save the mock LowProfileId so verify can find this booking
    try {
      const supabase = createAdminClient()
      await supabase
        .from('pending_bookings')
        .update({
          cardcom_low_profile_id: mockLowProfileId,
          status: 'paid', // mock bypass — mark as paid immediately
          cardcom_response_code: '0',
          cardcom_description: 'MOCK',
          cardcom_tranzaction_id: 0,
        })
        .eq('unique_payment_id', uniqueId)

      await logPaymentEvent({
        uniquePaymentId: uniqueId,
        lowProfileId: mockLowProfileId,
        stage: 'cardcom_mock_paid',
        status: 'success',
        message: 'Mock payment marked as paid locally',
        data: { totalPrice, operation },
        supabase,
      })
    } catch (err) {
      console.error('🧪 [MOCK] Failed to save mock LowProfileId:', err)
      await logPaymentEvent({
        uniquePaymentId: uniqueId,
        lowProfileId: mockLowProfileId,
        stage: 'cardcom_mock_update_failed',
        status: 'error',
        message: err instanceof Error ? err.message : String(err),
        data: { totalPrice, operation },
      })
    }

    const mockUrl = buildMockCheckoutUrl(siteUrl, uniqueId, totalPrice, mockLowProfileId)
    console.log('🧪 [MOCK] Redirecting to mock checkout:', mockUrl)
    return NextResponse.json({ paymentUrl: mockUrl, uniqueId, mock: true })
  }

  // ── Request a Cardcom LowProfile payment page URL ─────────────────────────
  // אם נשלח טוקן בדיקה תקף — מחיר ₪1 (תשלום אמיתי לצורך בדיקת webhook/WhatsApp)
  const chargeAmount = isValidTestToken(submittedTestToken) ? 1 : totalPrice
  if (chargeAmount !== totalPrice) {
    console.log(`🧪 [TEST TOKEN] Price overridden: ₪${totalPrice} → ₪${chargeAmount}`)
    await logPaymentEvent({
      uniquePaymentId: uniqueId,
      stage: 'cardcom_test_price_applied',
      status: 'info',
      message: 'Test token lowered Cardcom charge amount',
      data: { originalAmount: totalPrice, chargeAmount },
    })
  }

  try {
    const { url: paymentUrl, lowProfileId } = await createLowProfile({
      amount: chargeAmount,
      uniqueId,
      operation,
      guestName,
      email: String(data.email),
      phone: data.phone ? String(data.phone) : undefined,
      description: `לינה ${checkIn} — ${checkOut}`,
      checkIn,
      checkOut,
      successUrl: `${siteUrl}/payment/success`,
      failedUrl: `${siteUrl}/payment/error`,
      cancelUrl: `${siteUrl}/payment/cancel`,
      webhookUrl: `${siteUrl}/api/cardcom/webhook`,
      language: 'he',
    })

    const supabase = createAdminClient()
    await supabase
      .from('pending_bookings')
      .update({ cardcom_low_profile_id: lowProfileId })
      .eq('unique_payment_id', uniqueId)

    console.log('✅ Cardcom LowProfile created:', { uniqueId, lowProfileId, totalPrice, operation })
    await logPaymentEvent({
      uniquePaymentId: uniqueId,
      lowProfileId,
      stage: 'cardcom_lowprofile_created',
      status: 'success',
      message: 'Cardcom LowProfile payment page created',
      data: {
        totalPrice,
        chargeAmount,
        operation,
        guestName,
        email: String(data.email),
        checkIn,
        checkOut,
      },
      supabase,
    })
    return NextResponse.json({ paymentUrl, uniqueId })
  } catch (err) {
    console.error('❌ Cardcom createLowProfile error:', err)
    await logPaymentEvent({
      uniquePaymentId: uniqueId,
      stage: 'cardcom_lowprofile_failed',
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
      data: {
        totalPrice,
        chargeAmount,
        operation,
        guestName,
        email: String(data.email),
        checkIn,
        checkOut,
      },
    })

    try {
      const supabase = createAdminClient()
      await supabase.from('pending_bookings').delete().eq('unique_payment_id', uniqueId)
    } catch {
      // non-critical
    }

    return NextResponse.json(
      {
        error: 'אירעה שגיאה בשרת, אנא נסה שוב מאוחר יותר. אם השגיאה חוזרת, צור קשר.',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    )
  }
}
