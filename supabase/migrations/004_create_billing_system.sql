-- Billing and subscription system for HOSTLY
-- This migration creates tables for managing subscriptions, invoices, and usage tracking

-- ============================================
-- 1. SUBSCRIPTION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  yearly_price DECIMAL(10, 2),
  max_properties INTEGER,
  max_whatsapp_per_month INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (id, name, display_name, description, monthly_price, yearly_price, max_properties, max_whatsapp_per_month, features)
VALUES
  ('free', 'free', 'חינם', 'תוכנית ניסיון', 0, 0, 1, 50, '["דשבורד בסיסי", "עד 50 הודעות WhatsApp", "תמיכה בסיסית"]'::jsonb),
  ('basic', 'basic', 'בסיסי', 'למתחילים', 99, 990, 1, 200, '["דשבורד מלא", "עד 200 הודעות WhatsApp", "תמיכה מהירה", "1 יחידה"]'::jsonb),
  ('pro', 'pro', 'מקצועי', 'לבעלי יחידות רציניים', 199, 1990, 5, 1000, '["דשבורד מתקדם", "עד 1000 הודעות WhatsApp", "תמיכה VIP", "עד 5 יחידות", "דוחות מתקדמים"]'::jsonb),
  ('enterprise', 'enterprise', 'ארגוני', 'לרשתות גדולות', 399, 3990, 999, 999999, '["הכל ללא הגבלה", "תמיכה 24/7", "API מלא", "יחידות ללא הגבלה", "אנליטיקס מתקדם"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'suspended')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)  -- One subscription per user
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- ============================================
-- 3. INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  stripe_invoice_id TEXT,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issued_at ON invoices(issued_at);

-- ============================================
-- 4. USAGE TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: YYYY-MM
  whatsapp_sent INTEGER DEFAULT 0,
  whatsapp_failed INTEGER DEFAULT 0,
  bookings_created INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, month)
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_month ON usage_stats(user_id, month);
CREATE INDEX IF NOT EXISTS idx_usage_stats_month ON usage_stats(month);

-- ============================================
-- 5. PAYMENT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_invoice_id ON payment_history(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);

-- ============================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_billing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at();

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at();

CREATE TRIGGER usage_stats_updated_at
  BEFORE UPDATE ON usage_stats
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Policies: Allow read for all tables (we'll verify in API)
CREATE POLICY "Allow read subscription_plans" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Allow read subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow read usage_stats" ON usage_stats FOR SELECT USING (true);
CREATE POLICY "Allow read payment_history" ON payment_history FOR SELECT USING (true);

-- Policies: Allow insert/update/delete (we'll verify in API)
CREATE POLICY "Allow all subscriptions" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow all invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all usage_stats" ON usage_stats FOR ALL USING (true);
CREATE POLICY "Allow all payment_history" ON payment_history FOR ALL USING (true);

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id TEXT,
  p_whatsapp_sent INTEGER DEFAULT 0,
  p_whatsapp_failed INTEGER DEFAULT 0,
  p_bookings_created INTEGER DEFAULT 0,
  p_api_calls INTEGER DEFAULT 0
)
RETURNS void AS $$
DECLARE
  current_month TEXT;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  INSERT INTO usage_stats (user_id, month, whatsapp_sent, whatsapp_failed, bookings_created, api_calls)
  VALUES (p_user_id, current_month, p_whatsapp_sent, p_whatsapp_failed, p_bookings_created, p_api_calls)
  ON CONFLICT (user_id, month) DO UPDATE SET
    whatsapp_sent = usage_stats.whatsapp_sent + EXCLUDED.whatsapp_sent,
    whatsapp_failed = usage_stats.whatsapp_failed + EXCLUDED.whatsapp_failed,
    bookings_created = usage_stats.bookings_created + EXCLUDED.bookings_created,
    api_calls = usage_stats.api_calls + EXCLUDED.api_calls,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has exceeded limits
CREATE OR REPLACE FUNCTION check_user_limits(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  v_subscription RECORD;
  v_plan RECORD;
  v_usage RECORD;
  v_result JSONB;
BEGIN
  -- Get user subscription
  SELECT * INTO v_subscription FROM subscriptions WHERE user_id = p_user_id AND status = 'active';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('has_active_subscription', false, 'can_send_whatsapp', false);
  END IF;
  
  -- Get plan details
  SELECT * INTO v_plan FROM subscription_plans WHERE id = v_subscription.plan_id;
  
  -- Get current month usage
  SELECT * INTO v_usage FROM usage_stats 
  WHERE user_id = p_user_id AND month = TO_CHAR(NOW(), 'YYYY-MM');
  
  IF NOT FOUND THEN
    v_usage.whatsapp_sent := 0;
  END IF;
  
  -- Build result
  v_result := jsonb_build_object(
    'has_active_subscription', true,
    'plan_name', v_plan.display_name,
    'can_send_whatsapp', v_usage.whatsapp_sent < v_plan.max_whatsapp_per_month,
    'whatsapp_used', v_usage.whatsapp_sent,
    'whatsapp_limit', v_plan.max_whatsapp_per_month,
    'whatsapp_remaining', v_plan.max_whatsapp_per_month - v_usage.whatsapp_sent
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. INSERT DEFAULT SUBSCRIPTIONS FOR EXISTING USERS
-- ============================================
-- Give all existing users a free trial
INSERT INTO subscriptions (user_id, plan_id, status, billing_cycle, trial_ends_at, expires_at)
SELECT 
  id,
  'free',
  'trial',
  'monthly',
  NOW() + INTERVAL '30 days',
  NOW() + INTERVAL '30 days'
FROM users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE subscription_plans IS 'Available subscription plans';
COMMENT ON TABLE subscriptions IS 'User subscriptions';
COMMENT ON TABLE invoices IS 'Billing invoices';
COMMENT ON TABLE usage_stats IS 'Monthly usage tracking per user';
COMMENT ON TABLE payment_history IS 'Payment transaction history';
