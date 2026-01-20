import { NextResponse } from 'next/server'

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
