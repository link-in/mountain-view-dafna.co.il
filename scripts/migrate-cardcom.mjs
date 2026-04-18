/**
 * One-time migration script — adds Cardcom columns to pending_bookings.
 *
 * Usage:
 *   node scripts/migrate-cardcom.mjs
 *
 * Requires SUPABASE_ACCESS_TOKEN in your environment.
 * Get it from: https://supabase.com/dashboard/account/tokens
 * (This is different from the service role key — it's a personal token)
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local ───────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  try {
    const contents = readFileSync(envPath, 'utf-8')
    for (const line of contents.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    console.warn('⚠️  Could not read .env.local — using existing environment variables')
  }
}

loadEnv()

// ── Extract project ref from Supabase URL ────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
const accessToken = process.env.SUPABASE_ACCESS_TOKEN

if (!projectRef) {
  console.error('❌ Could not extract project ref from NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}

if (!accessToken) {
  console.error(`
❌  Missing SUPABASE_ACCESS_TOKEN

Get your personal access token from:
  https://supabase.com/dashboard/account/tokens

Then run:
  $env:SUPABASE_ACCESS_TOKEN="sbp_xxxx..."; node scripts/migrate-cardcom.mjs
`)
  process.exit(1)
}

// ── SQL statements ────────────────────────────────────────────────────────
const SQL = `
ALTER TABLE pending_bookings
  ADD COLUMN IF NOT EXISTS cardcom_low_profile_id TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_operation TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_tranzaction_id BIGINT,
  ADD COLUMN IF NOT EXISTS cardcom_token TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_token_card_year INTEGER,
  ADD COLUMN IF NOT EXISTS cardcom_token_card_month INTEGER,
  ADD COLUMN IF NOT EXISTS cardcom_token_approval_number TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_token_card_owner_identity_number TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_response_code TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_description TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_document_type TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_document_number INTEGER;

CREATE INDEX IF NOT EXISTS idx_pending_bookings_cardcom_lp
  ON pending_bookings (cardcom_low_profile_id);
`

// ── Run via Supabase Management API ──────────────────────────────────────
async function runMigration() {
  console.log(`🔗 Connecting to project: ${projectRef}`)

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    }
  )

  const text = await response.text()

  if (!response.ok) {
    console.error(`❌ Migration failed (HTTP ${response.status}):`)
    console.error(text)
    process.exit(1)
  }

  console.log('✅ Migration completed successfully!')
  console.log('   Columns added to pending_bookings:')
  console.log('   - cardcom_low_profile_id (indexed)')
  console.log('   - cardcom_operation')
  console.log('   - cardcom_tranzaction_id')
  console.log('   - cardcom_token + card info')
  console.log('   - cardcom_response_code / description')
  console.log('   - cardcom_document_type / number')
}

runMigration().catch((err) => {
  console.error('❌ Unexpected error:', err)
  process.exit(1)
})
