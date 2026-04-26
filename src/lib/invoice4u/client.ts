import { z } from 'zod'

const DEFAULT_INVOICE4U_CREATE_URL = 'https://api.invoice4u.co.il/v1/Documents/Create'

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
  pdfUrl?: string
  response: UnknownRecord
}

function getInvoice4UApiKey(): string {
  const apiKey = process.env.INVOICE4U_API_KEY

  if (!apiKey) {
    throw new Error('Missing INVOICE4U_API_KEY environment variable')
  }

  return apiKey
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

function findStringField(value: unknown, fieldNames: string[]): string | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const record = value as UnknownRecord

  for (const fieldName of fieldNames) {
    const fieldValue = toStringOrUndefined(record[fieldName])
    if (fieldValue) {
      return fieldValue
    }
  }

  for (const nestedValue of Object.values(record)) {
    const nestedResult = findStringField(nestedValue, fieldNames)
    if (nestedResult) {
      return nestedResult
    }
  }

  return undefined
}

function findBooleanField(value: unknown, fieldNames: string[]): boolean | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const record = value as UnknownRecord

  for (const fieldName of fieldNames) {
    if (typeof record[fieldName] === 'boolean') {
      return record[fieldName]
    }
  }

  for (const nestedValue of Object.values(record)) {
    const nestedResult = findBooleanField(nestedValue, fieldNames)
    if (nestedResult !== undefined) {
      return nestedResult
    }
  }

  return undefined
}

function extractInvoiceResult(response: UnknownRecord): Invoice4UDocumentResult {
  const success = findBooleanField(response, ['IsSuccess', 'Success', 'Succeeded'])

  if (success === false) {
    const message =
      findStringField(response, ['ErrorMessage', 'Message', 'Description']) ??
      'Invoice4U returned an unsuccessful response'
    throw new Error(`Invoice4U error: ${message}`)
  }

  const documentId = findStringField(response, [
    'DocumentId',
    'DocumentID',
    'DocumentNumber',
    'Id',
    'ID',
  ])
  const pdfUrl = findStringField(response, ['PdfUrl', 'PDFUrl', 'PdfLink', 'DocumentUrl', 'Url'])

  if (!documentId && !pdfUrl) {
    throw new Error('Invoice4U response is missing a document ID or PDF URL')
  }

  return {
    documentId,
    pdfUrl,
    response,
  }
}

export async function processSuccessfulPayment(
  cardcomData: CardcomSuccessfulPaymentData
): Promise<Invoice4UDocumentResult> {
  const apiKey = getInvoice4UApiKey()
  const payment = normalizeCardcomPayment(cardcomData)

  const payload = {
    General: {
      ApiKey: apiKey,
      DocumentType: 3,
      Subject: 'רכישה באתר - קארדקום',
      Recipient: {
        Name: payment.customerName,
        ...(payment.email ? { Email: payment.email } : {}),
      },
      IsSendOriginiByEmail: true,
    },
    Items: [
      {
        Name: 'רכישה מקוונת',
        Quantity: 1,
        Price: payment.amount,
        VatIncluded: true,
      },
    ],
    Payments: [
      {
        PaymentType: 3,
        Amount: payment.amount,
        CreditCardDetails: {
          ...(payment.cardName ? { CardName: payment.cardName } : {}),
          TransactionId: payment.transactionId,
          ...(payment.last4Digits ? { Last4Digits: payment.last4Digits } : {}),
          PaymentsNumber: payment.paymentsNumber,
        },
      },
    ],
  }

  const response = await fetch(getInvoice4UCreateUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Invoice4U HTTP error ${response.status}: ${details}`)
  }

  const parsedResponse = invoice4uResponseSchema.parse(await response.json())
  return extractInvoiceResult(parsedResponse)
}
