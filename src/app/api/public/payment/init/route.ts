import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createLowProfile, type CardcomOperation } from '@/lib/cardcom/client'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mountain-view-dafna.co.il'

/**
 * Mock mode is activated when EITHER:
 *   1. CARDCOM_MOCK_MODE=true (legacy, useful for local dev)
 *   2. The request includes a `testToken` matching CARDCOM_TEST_TOKEN
 *      → lets you test in production via URL (?test=<token>)
 */
function isMockMode(submittedTestToken?: string): boolean {
  if (process.env.CARDCOM_MOCK_MODE === 'true') return true

  const expectedToken = process.env.CARDCOM_TEST_TOKEN
  if (expectedToken && submittedTestToken && submittedTestToken === expectedToken) {
    return true
  }

  return false
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
      return NextResponse.json({ error: 'Failed to save booking data' }, { status: 500 })
    }
  } catch (err) {
    console.error('❌ Supabase error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // ── MOCK MODE ─────────────────────────────────────────────────────────────
  const submittedTestToken = typeof data.testToken === 'string' ? data.testToken : undefined
  if (isMockMode(submittedTestToken)) {
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
    } catch (err) {
      console.error('🧪 [MOCK] Failed to save mock LowProfileId:', err)
    }

    const mockUrl = buildMockCheckoutUrl(siteUrl, uniqueId, totalPrice, mockLowProfileId)
    console.log('🧪 [MOCK] Redirecting to mock checkout:', mockUrl)
    return NextResponse.json({ paymentUrl: mockUrl, uniqueId, mock: true })
  }

  // ── Request a Cardcom LowProfile payment page URL ─────────────────────────
  try {
    const { url: paymentUrl, lowProfileId } = await createLowProfile({
      amount: totalPrice,
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
    return NextResponse.json({ paymentUrl, uniqueId })
  } catch (err) {
    console.error('❌ Cardcom createLowProfile error:', err)

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
