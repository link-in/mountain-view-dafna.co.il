import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'

export const dynamic = 'force-dynamic'  // Allow POST requests for creating bookings
export const revalidate = 0

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'

const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL

export async function GET() {
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
    const response = await fetchWithTokenRefresh(url.toString())

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
    
    // Build booking object with all required fields
    const booking: Record<string, unknown> = {
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
    
    // Add optional fields if provided
    if (item.mobile) booking.mobile = item.mobile
    if (item.phone) booking.phone = item.phone
    if (item.email) booking.email = item.email
    if (item.numAdult) booking.numAdult = item.numAdult
    if (item.numChild) booking.numChild = item.numChild
    if (item.notes) booking.notes = item.notes
    if (item.address) booking.address = item.address
    if (item.city) booking.city = item.city
    if (item.postcode) booking.postcode = item.postcode
    if (item.country) booking.country = item.country
    
    return booking
  }

  const normalizedPayload = Array.isArray(payload)
    ? payload.map((item) => normalizeItem(item as Record<string, unknown>))
    : [normalizeItem(payload as Record<string, unknown>)]

  console.log('Beds24 booking payload', normalizedPayload)

  const response = await fetchWithTokenRefresh(`${getBaseUrl()}/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
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
