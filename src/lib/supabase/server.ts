import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

/**
 * Create a Supabase client for server-side operations.
 * Uses the anon key and respects Row Level Security (RLS).
 */
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Create a Supabase admin client that bypasses Row Level Security.
 * Use ONLY in trusted server-side code (API routes, webhooks) — never on the client.
 * Required for payment flows where we insert/update on behalf of anonymous guests.
 */
export function createAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
