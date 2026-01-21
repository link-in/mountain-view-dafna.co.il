import { NextResponse } from 'next/server'
import { fetchWithTokenRefresh } from '@/lib/beds24/tokenManager'

export const dynamic = 'force-static'
export const revalidate = false

const DEFAULT_BASE_URL = 'https://api.beds24.com/v2'

const getBaseUrl = () => process.env.BEDS24_API_BASE_URL ?? DEFAULT_BASE_URL

export async function GET() {
  const url = new URL(`${getBaseUrl()}/pricing`)

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
