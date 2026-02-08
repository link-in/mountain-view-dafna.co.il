/**
 * Admin Reviews Sync API Endpoint
 * POST /api/admin/reviews/sync - Manually trigger reviews sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { syncAllReviews, getSyncStats } from '@/lib/reviews/sync-service'
import { authOptions } from '@/lib/auth/authOptions'

/**
 * POST /api/admin/reviews/sync
 * Trigger manual sync of all reviews
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }

    console.log(`Reviews sync triggered by: ${session.user.email}`)

    // Trigger sync
    const stats = await syncAllReviews()

    return NextResponse.json({
      success: true,
      message: 'Reviews synced successfully',
      stats,
    })
  } catch (error) {
    console.error('Error in POST /api/admin/reviews/sync:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/reviews/sync
 * Get sync statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }

    const stats = await getSyncStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/reviews/sync:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
