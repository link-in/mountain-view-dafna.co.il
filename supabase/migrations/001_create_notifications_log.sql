-- Create notifications_log table to store all webhook events from Beds24
-- This serves as a backup of all messages we planned to send via WhatsApp

CREATE TABLE IF NOT EXISTS notifications_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in_date TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'sent', 'failed', 'pending')),
  whatsapp_sent_at TIMESTAMPTZ,
  whatsapp_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_log_created_at ON notifications_log(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_notifications_log_status ON notifications_log(status);

-- Create an index on phone for guest lookup
CREATE INDEX IF NOT EXISTS idx_notifications_log_phone ON notifications_log(phone);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notifications_log_updated_at
  BEFORE UPDATE ON notifications_log
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_log_updated_at();

-- Add comments for documentation
COMMENT ON TABLE notifications_log IS 'Logs all webhook events received from Beds24 and tracks WhatsApp message delivery';
COMMENT ON COLUMN notifications_log.guest_name IS 'Name of the guest from Beds24';
COMMENT ON COLUMN notifications_log.phone IS 'Phone number of the guest';
COMMENT ON COLUMN notifications_log.check_in_date IS 'Check-in date from the booking';
COMMENT ON COLUMN notifications_log.raw_payload IS 'Full JSON payload received from Beds24 webhook';
COMMENT ON COLUMN notifications_log.status IS 'Status of the notification: received, sent, failed, or pending';
COMMENT ON COLUMN notifications_log.whatsapp_sent_at IS 'Timestamp when WhatsApp message was successfully sent';
COMMENT ON COLUMN notifications_log.whatsapp_error IS 'Error message if WhatsApp sending failed';
