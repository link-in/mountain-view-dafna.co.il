/**
 * Cron Job Endpoint for Reviews Sync
 * GET /api/cron/sync-reviews
 * 
 * This endpoint is called by Vercel Cron or other scheduling service
 * to automatically sync reviews on a schedule (e.g., daily at 2 AM)
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncAllReviews } from '@/lib/reviews/sync-service'

export const maxDuration = 60 // Allow up to 60 seconds for this endpoint
export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/sync-reviews
 * Trigger automatic reviews sync
 * Protected by CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // Check for authorization header
    if (!authHeader) {
      console.error('Cron job called without authorization header')
      return NextResponse.json(
        { error: 'Unauthorized - Missing authorization header' },
        { status: 401 }
      )
    }

    // Verify the secret if configured
    if (cronSecret) {
      const expectedAuth = `Bearer ${cronSecret}`
      
      if (authHeader !== expectedAuth) {
        console.error('Cron job called with invalid secret')
        return NextResponse.json(
          { error: 'Unauthorized - Invalid authorization' },
          { status: 401 }
        )
      }
    }

    console.log('🔄 Automated reviews sync started by cron job')

    // Trigger sync
    const stats = await syncAllReviews()

    console.log('✅ Automated reviews sync completed:', stats)

    return NextResponse.json({
      success: true,
      message: 'Reviews synced successfully by cron job',
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error in cron reviews sync:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
