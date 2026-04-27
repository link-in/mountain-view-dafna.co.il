import { NextResponse } from 'next/server'
import { z } from 'zod'
import { processSuccessfulPayment } from '@/lib/invoice4u/client'
import { logPaymentEvent } from '@/lib/payment-audit/logPaymentEvent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const testInvoiceSchema = z.object({
  token: z.string().optional(),
  amount: z.coerce.number().positive().default(1),
  customerName: z.string().trim().min(1).default('בדיקת מערכת'),
  email: z.string().trim().email().optional(),
})

function getExpectedToken(): string | undefined {
  return process.env.INVOICE4U_TEST_TOKEN ?? process.env.CARDCOM_TEST_TOKEN ?? process.env.CRON_SECRET
}

function getSubmittedToken(request: Request, bodyToken?: string): string | undefined {
  const { searchParams } = new URL(request.url)
  return (
    request.headers.get('x-test-token') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    searchParams.get('token') ??
    bodyToken
  )
}

/**
 * POST /api/test/invoice4u
 *
 * Isolated Invoice4U smoke test. This creates a real Invoice4U document, so it is
 * protected by a server-side test token and should be used with a small amount.
 */
export async function POST(request: Request) {
  let body: unknown = {}

  try {
    body = await request.json()
  } catch {
    // Body is optional; defaults create a NIS 1 test document.
  }

  const parsed = testInvoiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const expectedToken = getExpectedToken()
  const submittedToken = getSubmittedToken(request, parsed.data.token)

  if (!expectedToken || submittedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const testId = `invoice4u-test-${Date.now()}`
  const confirmationNo = `TEST-${Date.now()}`

  await logPaymentEvent({
    uniquePaymentId: testId,
    stage: 'invoice4u_manual_test_started',
    status: 'info',
    message: 'Manual isolated Invoice4U test started',
    data: {
      amount: parsed.data.amount,
      customerName: parsed.data.customerName,
      hasEmail: Boolean(parsed.data.email),
    },
  })

  try {
    const result = await processSuccessfulPayment({
      Sum: parsed.data.amount,
      ConfirmationNo: confirmationNo,
      TransactionId: confirmationNo,
      L4Digit: '0000',
      CardType: 'Visa',
      CustomerName: parsed.data.customerName,
      Email: parsed.data.email,
      NumOfPayments: 1,
    })

    await logPaymentEvent({
      uniquePaymentId: testId,
      stage: 'invoice4u_manual_test_success',
      status: 'success',
      message: 'Manual isolated Invoice4U test document created',
      data: {
        documentId: result.documentId ?? '',
        pdfUrl: result.pdfUrl ?? '',
        amount: parsed.data.amount,
      },
    })

    return NextResponse.json({
      success: true,
      testId,
      documentId: result.documentId,
      pdfUrl: result.pdfUrl,
      response: result.response,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    await logPaymentEvent({
      uniquePaymentId: testId,
      stage: 'invoice4u_manual_test_failed',
      status: 'error',
      message,
      data: {
        amount: parsed.data.amount,
        confirmationNo,
      },
    })

    console.error('❌ [Invoice4U Test] Failed:', message)
    return NextResponse.json({ success: false, testId, error: message }, { status: 502 })
  }
}
