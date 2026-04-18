import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST /api/public/payment/webhook
 *
 * Receives the Cardcom LowProfile webhook (LowProfileResult payload).
 * Per Cardcom best-practice, we do NOT update booking state here —
 * the actual verification is done by the guest's browser hitting /verify
 * which calls GetLpResult directly (server-to-server).
 *
 * This endpoint simply acknowledges receipt (HTTP 200) and logs the payload
 * for audit/debugging purposes.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lowProfileId: string = body?.LowProfileId ?? 'unknown'
    const responseCode: number = body?.ResponseCode ?? -1
    const transactionId: number | null = body?.TranzactionId ?? null

    console.log('📩 [Cardcom Webhook] Received:', {
      lowProfileId,
      responseCode,
      transactionId,
    })
  } catch {
    console.warn('⚠️ [Cardcom Webhook] Could not parse body')
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
