/**
 * Public Reviews API Endpoint
 * GET /api/reviews - Fetch active reviews for display
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Format date to Hebrew month format
 */
function formatDate(date: string): string {
  const d = new Date(date)
  const months = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ]

  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Generate default avatar based on source
 */
function generateDefaultAvatar(name: string, source: string): string {
  const colors: { [key: string]: string } = {
    booking: '003580',
    airbnb: 'FF5A5F',
    google: '4285F4',
  }

  const color = colors[source] || '0d9488'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`
}

/**
 * GET /api/reviews
 * Fetch active reviews from database
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const source = searchParams.get('source') // Optional filter by source

    // Build query
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('review_date', { ascending: false })
      .limit(limit)

    // Add source filter if provided
    if (source && ['airbnb', 'booking', 'google'].includes(source)) {
      query = query.eq('source', source)
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`📊 Fetched ${reviews?.length || 0} reviews from database`)
    
    if (reviews && reviews.length > 0) {
      console.log('Review sources breakdown:')
      const bySource = reviews.reduce((acc: any, r: any) => {
        acc[r.source] = (acc[r.source] || 0) + 1
        return acc
      }, {})
      console.log(bySource)
    }

    if (!reviews || reviews.length === 0) {
      console.log('⚠️ No reviews found in database')
      // Return empty array if no reviews
      return NextResponse.json([])
    }

    // Transform to match existing Review interface
    const transformedReviews = reviews.map((r) => ({
      id: r.external_id,
      userName: r.user_name,
      userImage: r.user_image || generateDefaultAvatar(r.user_name, r.source),
      location: r.location,
      rating: r.rating,
      date: formatDate(r.review_date),
      comment: r.comment,
      source: r.source,
      hostResponse: r.host_response || undefined,
    }))

    // Add cache headers (cache for 1 hour)
    return NextResponse.json(transformedReviews, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error in GET /api/reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
