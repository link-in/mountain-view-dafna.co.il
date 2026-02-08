/**
 * Admin API - Update review name manually
 * For Airbnb reviews where we can't find the booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

    const { external_id, user_name } = await request.json()

    if (!external_id || !user_name) {
      return NextResponse.json(
        { error: 'Missing external_id or user_name' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update the review name
    const { data, error } = await supabase
      .from('reviews')
      .update({ user_name })
      .eq('external_id', external_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating review name:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Updated review ${external_id} name to: ${user_name}`)

    return NextResponse.json({
      success: true,
      review: data,
    })
  } catch (error) {
    console.error('Error in update-name API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
