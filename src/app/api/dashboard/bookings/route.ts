import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'

export const dynamic = 'force-static'
export const revalidate = false

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'

const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL

const getApiKey = () => process.env.BEDS24_TOKEN ?? process.env.BEDS24_API_KEY

export async function GET() {
  const apiKey = getApiKey()

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing BEDS24_TOKEN' }, { status: 500 })
  }

  const url = new URL(`${getBaseUrl()}/bookings`)
  const query = process.env.BEDS24_BOOKINGS_QUERY
  if (query) {
    const params = new URLSearchParams(query)
    params.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  } else {
    url.searchParams.set('arrivalFrom', '2024-01-01')
    url.searchParams.set('includeInvoice', 'true')
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
        token: apiKey,
      },
    })

    if (!response.ok) {
      const details = await response.text()
      return NextResponse.json(
        { error: 'Beds24 request failed', status: response.status, details },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to reach Beds24',
        details: error instanceof Error ? error.message : String(error),
        endpoint: url.toString(),
      },
      { status: 502 }
    )
  }
}

export async function POST(request: Request) {
  const apiKey = getApiKey()

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing BEDS24_TOKEN' }, { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  const propertyId = session?.user?.propertyId ?? process.env.BEDS24_PROPERTY_ID
  const roomId = session?.user?.roomId ?? process.env.BEDS24_ROOM_ID

  if (!propertyId || !roomId) {
    return NextResponse.json({ error: 'Missing BEDS24_PROPERTY_ID or BEDS24_ROOM_ID' }, { status: 500 })
  }

  const extractInvoiceTotal = (items: unknown[]) => {
    return items.reduce<number>((sum, entry) => {
      if (!entry || typeof entry !== 'object') {
        return sum
      }
      const amount =
        (typeof (entry as { amount?: unknown }).amount === 'number' && (entry as { amount: number }).amount) ||
        (typeof (entry as { amount?: unknown }).amount === 'string' && Number.parseFloat((entry as { amount: string }).amount)) ||
        (typeof (entry as { total?: unknown }).total === 'number' && (entry as { total: number }).total) ||
        (typeof (entry as { total?: unknown }).total === 'string' && Number.parseFloat((entry as { total: string }).total)) ||
        0
      return Number.isFinite(amount) ? sum + amount : sum
    }, 0)
  }

  const normalizeItem = (item: Record<string, unknown>) => {
    const invoiceItems = Array.isArray(item.invoice) ? item.invoice : []
    const explicitPrice =
      (typeof item.price === 'number' && item.price) ||
      (typeof item.price === 'string' && Number.parseFloat(item.price)) ||
      0
    const invoiceTotal = extractInvoiceTotal(invoiceItems)
    const price = explicitPrice || invoiceTotal
    return {
      propertyId: Number(propertyId),
      roomId: Number(roomId),
      arrival: item.arrival,
      departure: item.departure,
      firstName: item.firstName,
      lastName: item.lastName,
      status: item.status ?? 'confirmed',
      invoice: invoiceItems,
      ...(price ? { price } : {}),
    }
  }

  const normalizedPayload = Array.isArray(payload)
    ? payload.map((item) => normalizeItem(item as Record<string, unknown>))
    : [normalizeItem(payload as Record<string, unknown>)]

  console.log('Beds24 booking payload', normalizedPayload)

  const response = await fetch(`${getBaseUrl()}/bookings`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      token: apiKey,
    },
    body: JSON.stringify(normalizedPayload),
  })

  if (!response.ok) {
    const details = await response.text()
    return NextResponse.json(
      { error: 'Beds24 request failed', status: response.status, details },
      { status: 502 }
    )
  }

  const data = await response.json()
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ data, debugPayload: normalizedPayload })
  }
  return NextResponse.json(data)
}
