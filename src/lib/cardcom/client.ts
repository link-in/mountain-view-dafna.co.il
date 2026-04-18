const CARDCOM_API_BASE = 'https://secure.cardcom.solutions/api/v11'

// ── Types ──────────────────────────────────────────────────────────────────

export type CardcomOperation = 'ChargeOnly' | 'CreateTokenOnly'

export interface CreateLowProfileParams {
  amount: number
  uniqueId: string
  operation: CardcomOperation
  guestName: string
  email: string
  phone?: string
  description: string
  checkIn: string
  checkOut: string
  successUrl: string
  failedUrl: string
  cancelUrl?: string
  webhookUrl: string
  language?: 'he' | 'en'
}

export interface CreateLowProfileResult {
  lowProfileId: string
  url: string
}

export interface DocumentInfo {
  DocumentType: string | null
  DocumentNumber: number | null
}

export interface TokenInfo {
  Token: string | null
  CardYear: number | null
  CardMonth: number | null
  TokenApprovalNumber: string | null
  CardOwnerIdentityNumber: string | null
}

export interface TransactionInfo {
  TransactionId: number
  AuthNum: string
  Sum: number
  CurrencyType: number
  CardName: string
  Last4Digits: string
}

export interface LowProfileResult {
  ResponseCode: number
  Description: string | null
  TerminalNumber: number
  LowProfileId: string
  TranzactionId: number | null
  ReturnValue: string | null
  Operation: string | null
  DocumentInfo: DocumentInfo | null
  TokenInfo: TokenInfo | null
  TranzactionInfo: TransactionInfo | null
}

export interface RefundResult {
  ResponseCode: number
  Description: string | null
  NewDocumentNumber: number | null
  NewDocumentType: string | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getCredentials() {
  const terminalNumber = process.env.CARDCOM_TERMINAL_NUMBER
  const apiName = process.env.CARDCOM_API_NAME

  if (!terminalNumber || !apiName) {
    throw new Error('Missing CARDCOM_TERMINAL_NUMBER or CARDCOM_API_NAME environment variables')
  }

  return {
    TerminalNumber: Number(terminalNumber),
    ApiName: apiName,
  }
}

function getApiUrl() {
  return process.env.CARDCOM_API_URL ?? CARDCOM_API_BASE
}

// ── API calls ──────────────────────────────────────────────────────────────

/**
 * Create a Cardcom LowProfile (hosted redirect) payment page.
 * Returns the LowProfileId (save to DB) and Url (redirect the guest to this).
 *
 * Per spec: DocumentTypeToCreate must be "Auto", IsAllowEditDocument must be true,
 * and credentials must NEVER be exposed to the client.
 */
export async function createLowProfile(
  params: CreateLowProfileParams
): Promise<CreateLowProfileResult> {
  const { TerminalNumber, ApiName } = getCredentials()
  const lang = params.language === 'en' ? 'en' : 'he'

  const body = {
    TerminalNumber,
    ApiName,
    Operation: params.operation,
    ReturnValue: params.uniqueId,
    Amount: params.amount,
    SuccessRedirectUrl: params.successUrl,
    FailedRedirectUrl: params.failedUrl,
    ...(params.cancelUrl ? { CancelUrl: params.cancelUrl } : {}),
    WebHookUrl: params.webhookUrl,
    Language: lang,
    ISOCoinId: 1,
    UIDefinition: {
      CardOwnerNameValue: params.guestName,
      ...(params.phone ? { CardOwnerPhoneValue: params.phone } : {}),
      CardOwnerEmailValue: params.email,
    },
    Document: {
      DocumentTypeToCreate: 'Auto',
      IsAllowEditDocument: true,
      Name: params.guestName,
      Email: params.email,
      ...(params.phone ? { Mobile: params.phone } : {}),
      Language: lang,
      Products: [
        {
          Description: params.description,
          UnitCost: params.amount,
          Quantity: 1,
        },
      ],
    },
  }

  const response = await fetch(`${getApiUrl()}/LowProfile/Create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Cardcom HTTP error ${response.status}: ${text}`)
  }

  const data = (await response.json()) as {
    ResponseCode: number
    Description?: string
    LowProfileId?: string
    Url?: string
  }

  if (data.ResponseCode !== 0) {
    throw new Error(`Cardcom error (${data.ResponseCode}): ${data.Description ?? 'Unknown error'}`)
  }

  if (!data.LowProfileId || !data.Url) {
    throw new Error('Cardcom response missing LowProfileId or Url')
  }

  return {
    lowProfileId: data.LowProfileId,
    url: data.Url,
  }
}

/**
 * Fetch the result of a LowProfile transaction by its ID.
 * Supports retry: set retries=1 to attempt once more on HTTP failure.
 * Timeout: 5 seconds per attempt.
 */
export async function getLowProfileResult(
  lowProfileId: string,
  retries = 1
): Promise<LowProfileResult> {
  const { TerminalNumber, ApiName } = getCredentials()

  const attempt = async (): Promise<Response> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    try {
      return await fetch(`${getApiUrl()}/LowProfile/GetLpResult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TerminalNumber, ApiName, LowProfileId: lowProfileId }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  let response: Response
  try {
    response = await attempt()
    if (!response.ok && retries > 0) {
      response = await attempt()
    }
  } catch (err) {
    if (retries > 0) {
      response = await attempt()
    } else {
      throw err
    }
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Cardcom GetLpResult HTTP error ${response.status}: ${text}`)
  }

  return (await response.json()) as LowProfileResult
}

/**
 * Full refund via Cardcom CancelDoc.
 * Requires ApiPassword (never exposed to the client).
 */
export async function cancelDocument(
  documentNumber: number,
  documentType: string
): Promise<RefundResult> {
  const { ApiName } = getCredentials()
  const apiPassword = process.env.CARDCOM_API_PASSWORD

  if (!apiPassword) {
    throw new Error('Missing CARDCOM_API_PASSWORD environment variable')
  }

  const response = await fetch(`${getApiUrl()}/Documents/CancelDoc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ApiName, ApiPassword: apiPassword, DocumentNumber: documentNumber, DocumentType: documentType }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Cardcom CancelDoc HTTP error ${response.status}: ${text}`)
  }

  return (await response.json()) as RefundResult
}
