-- Migration: Add Cardcom payment columns to pending_bookings
-- Run this in the Supabase SQL Editor

ALTER TABLE pending_bookings
  ADD COLUMN IF NOT EXISTS cardcom_low_profile_id          TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_operation               TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_tranzaction_id          BIGINT,
  ADD COLUMN IF NOT EXISTS cardcom_token                   TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_token_card_year         INTEGER,
  ADD COLUMN IF NOT EXISTS cardcom_token_card_month        INTEGER,
  ADD COLUMN IF NOT EXISTS cardcom_token_approval_number   TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_token_card_owner_identity_number TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_response_code           TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_description             TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_document_type           TEXT,
  ADD COLUMN IF NOT EXISTS cardcom_document_number         INTEGER;

-- Index for fast webhook lookup by LowProfileId
CREATE INDEX IF NOT EXISTS idx_pending_bookings_cardcom_lp
  ON pending_bookings (cardcom_low_profile_id);

-- Allow 'pending_charge' as a valid status value
-- (if your status column has a CHECK constraint, update it here)
-- ALTER TABLE pending_bookings DROP CONSTRAINT IF EXISTS pending_bookings_status_check;
-- ALTER TABLE pending_bookings ADD CONSTRAINT pending_bookings_status_check
--   CHECK (status IN ('pending', 'paid', 'failed', 'paid_beds24_error', 'pending_charge'));
