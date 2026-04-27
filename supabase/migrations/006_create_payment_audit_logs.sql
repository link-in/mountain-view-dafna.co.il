-- Create payment_audit_logs table for persistent payment flow diagnostics.
-- Run this in the Supabase SQL Editor before relying on audit logs in production.

CREATE TABLE IF NOT EXISTS payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_payment_id TEXT,
  low_profile_id TEXT,
  stage TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('info', 'success', 'error', 'warning')),
  message TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_unique_payment_id
  ON payment_audit_logs (unique_payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_low_profile_id
  ON payment_audit_logs (low_profile_id);

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_stage
  ON payment_audit_logs (stage);

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_created_at
  ON payment_audit_logs (created_at DESC);

COMMENT ON TABLE payment_audit_logs IS 'Persistent audit trail for direct website payment, Cardcom, Invoice4U, Beds24 and WhatsApp flow';
COMMENT ON COLUMN payment_audit_logs.unique_payment_id IS 'Internal unique payment ID generated before creating Cardcom LowProfile';
COMMENT ON COLUMN payment_audit_logs.low_profile_id IS 'Cardcom LowProfileId for correlating webhook events';
COMMENT ON COLUMN payment_audit_logs.stage IS 'Payment flow stage, e.g. booking_created, cardcom_webhook_received, invoice4u_failed';
COMMENT ON COLUMN payment_audit_logs.status IS 'Log severity/status: info, success, error, warning';
COMMENT ON COLUMN payment_audit_logs.data IS 'Structured JSON metadata for debugging and recovery';
