/**
 * Admin Bookings Sync API
 * Sync bookings from BEDS24 to local database
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { syncBookings } from '@/lib/bookings/sync-bookings'
import { authOptions } from '@/lib/auth/authOptions'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log(`Bookings sync triggered by: ${session.user.email}`)

    const stats = await syncBookings()

    return NextResponse.json({
      success: stats.success,
      message: `Synced ${stats.saved}/${stats.fetched} bookings`,
      stats,
    })
  } catch (error) {
    console.error('Error syncing bookings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
