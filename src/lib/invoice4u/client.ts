import { z } from 'zod'
import { randomUUID } from 'crypto'

const DEFAULT_INVOICE4U_CREATE_URL =
  'https://api.invoice4u.co.il/Services/ApiService.svc/CreateDocument'

const invoice4uResponseSchema = z.object({}).passthrough()

type UnknownRecord = Record<string, unknown>

export interface CardcomSuccessfulPaymentData {
  Sum?: number | string
  Amount?: number | string
  Price?: number | string
  ConfirmationNo?: number | string
  TransactionId?: number | string
  TranzactionId?: number | string
  L4Digit?: number | string
  Last4Digits?: number | string
  CardType?: string
  CardName?: string
  CustomerName?: string
  Name?: string
  Email?: string
  NumOfPayments?: number | string
  Recipient?: {
    Name?: string
    Email?: string
  }
  TransactionInfo?: {
    TransactionId?: number | string
    AuthNum?: number | string
    Sum?: number | string
    CardName?: string
    Last4Digits?: number | string
  }
  TranzactionInfo?: {
    TransactionId?: number | string
    AuthNum?: number | string
    Sum?: number | string
    CardName?: string
    Last4Digits?: number | string
  }
}

export interface Invoice4UDocumentResult {
  documentId?: string
  documentNumber?: string
  pdfUrl?: string
  response: UnknownRecord
}

function getInvoice4UToken(): string {
  const token = process.env.INVOICE4U_API_KEY ?? process.env.INVOICE4U_TOKEN

  if (!token) {
    throw new Error('Missing INVOICE4U_API_KEY environment variable')
  }

  return token
}

function getInvoice4UCreateUrl(): string {
  return process.env.INVOICE4U_CREATE_URL ?? DEFAULT_INVOICE4U_CREATE_URL
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function toStringOrUndefined(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return undefined
}

function normalizeCardcomPayment(cardcomData: CardcomSuccessfulPaymentData) {
  const transactionInfo = cardcomData.TransactionInfo ?? cardcomData.TranzactionInfo
  const amount = toNumber(cardcomData.Sum ?? cardcomData.Amount ?? cardcomData.Price ?? transactionInfo?.Sum)
  const transactionId = toStringOrUndefined(
    cardcomData.ConfirmationNo ??
      cardcomData.TransactionId ??
      cardcomData.TranzactionId ??
      transactionInfo?.AuthNum ??
      transactionInfo?.TransactionId
  )

  if (!amount || amount <= 0) {
    throw new Error('Cardcom payment data is missing a valid Sum/Amount/Price')
  }

  if (!transactionId) {
    throw new Error('Cardcom payment data is missing ConfirmationNo/TransactionId')
  }

  return {
    amount,
    transactionId,
    last4Digits: toStringOrUndefined(
      cardcomData.L4Digit ?? cardcomData.Last4Digits ?? transactionInfo?.Last4Digits
    ),
    cardName: cardcomData.CardType ?? cardcomData.CardName ?? transactionInfo?.CardName,
    customerName:
      cardcomData.CustomerName ?? cardcomData.Name ?? cardcomData.Recipient?.Name ?? 'לקוח כללי',
    email: cardcomData.Email ?? cardcomData.Recipient?.Email,
    paymentsNumber: toNumber(cardcomData.NumOfPayments) ?? 1,
  }
}

function extractInvoiceResult(response: UnknownRecord): Invoice4UDocumentResult {
  const root = (response.d && typeof response.d === 'object' ? response.d : response) as UnknownRecord
  const errors = Array.isArray(root.Errors) ? root.Errors : []

  if (errors.length > 0) {
    const firstError = errors[0] as UnknownRecord
    const errorCode = toStringOrUndefined(firstError.Error) ?? 'UnknownError'
    const errorId = toStringOrUndefined(firstError.ID)
    throw new Error(`Invoice4U error: ${errorCode}${errorId ? ` (ID ${errorId})` : ''}`)
  }

  const rawId = toStringOrUndefined(root.ID)
  const documentId = rawId && rawId !== '00000000-0000-0000-0000-000000000000' ? rawId : undefined
  const documentNumberRaw = toNumber(root.DocumentNumber)
  const documentNumber =
    typeof documentNumberRaw === 'number' && documentNumberRaw > 0
      ? String(documentNumberRaw)
      : undefined
  const pdfUrl = toStringOrUndefined(
    root.PdfUrl ?? root.PDFUrl ?? root.PdfLink ?? root.DocumentUrl ?? root.AttachmentUrl
  )

  if (!documentId && !documentNumber && !pdfUrl) {
    throw new Error('Invoice4U response did not include a created document')
  }

  return {
    documentId,
    documentNumber,
    pdfUrl,
    response,
  }
}

/**
 * DocumentType enum (Invoice4U API):
 * 1 = Invoice  2 = Receipt  3 = InvoiceReceipt (חשבונית מס קבלה)
 * 4 = InvoiceCredit  5 = ProformaInvoice  6 = InvoiceOrder  7 = InvoiceQuote
 *
 * PaymentType enum (required for Receipt / InvoiceReceipt docs):
 * 1 = CreditCard  2 = Check  3 = MoneyTransfer  4 = Cash  5 = Credit  7 = Other
 */
const DOC_TYPE_TAX_INVOICE_RECEIPT = 3
const PAYMENT_TYPE_CREDIT_CARD = 1

export async function processSuccessfulPayment(
  cardcomData: CardcomSuccessfulPaymentData
): Promise<Invoice4UDocumentResult> {
  const token = getInvoice4UToken()
  const createUrl = getInvoice4UCreateUrl()
  const payment = normalizeCardcomPayment(cardcomData)

  const associatedEmails = []
  if (payment.email) {
    associatedEmails.push({ Mail: payment.email, IsUserMail: false })
  }

  const nowMs = Date.now()
  const dateValue = `/Date(${nowMs}+0200)/`

  const payload = {
    doc: {
      GeneralCustomer: {
        Name: payment.customerName,
        ...(payment.last4Digits ? { Identifier: payment.last4Digits } : {}),
      },
      DocumentType: DOC_TYPE_TAX_INVOICE_RECEIPT,
      Subject: 'רכישה באתר - נוף הרים בדפנה',
      Currency: 'ILS',
      TaxIncluded: true,
      TaxPercentage: 18,
      RoundAmount: 0,
      ApiIdentifier: randomUUID(),
      Items: [
        {
          Code: '001',
          Name: 'לינה - נוף הרים בדפנה',
          Quantity: 1,
          Price: payment.amount,
        },
      ],
      Payments: [
        {
          PaymentType: PAYMENT_TYPE_CREDIT_CARD,
          Date: dateValue,
          Amount: payment.amount,
          ...(payment.cardName ? { CreditCardName: payment.cardName } : {}),
          NumberOfPayments: payment.paymentsNumber,
          PaymentNumber: 1,
          ExpirationDate: '',
        },
      ],
      ...(associatedEmails.length > 0 ? { AssociatedEmails: associatedEmails } : {}),
    },
    token,
  }

  const response = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Invoice4U HTTP error ${response.status}: ${details}`)
  }

  const parsedResponse = invoice4uResponseSchema.parse(await response.json())
  return extractInvoiceResult(parsedResponse as UnknownRecord)
}
