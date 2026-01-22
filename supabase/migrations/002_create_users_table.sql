-- Create users table for authentication and profile management
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  property_id TEXT NOT NULL,
  room_id TEXT NOT NULL,
  landing_page_url TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on property_id for faster lookups (for webhooks)
CREATE INDEX IF NOT EXISTS idx_users_property_id ON users(property_id);

-- Create index on room_id for faster lookups (for webhooks)
CREATE INDEX IF NOT EXISTS idx_users_room_id ON users(room_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL Security;

-- Policy: Users can read their own data
CREATE POLICY users_select_own
  ON users
  FOR SELECT
  USING (true); -- Allow all reads for now (authenticated via NextAuth)

-- Policy: Users can update their own data
CREATE POLICY users_update_own
  ON users
  FOR UPDATE
  USING (true); -- We'll verify user identity in the API route

-- Insert initial users from users.json
-- Note: Run this manually in Supabase SQL Editor after reviewing the data
INSERT INTO users (id, email, password_hash, display_name, property_id, room_id, landing_page_url, phone_number)
VALUES
  ('user_1', 'owner1@example.com', '$2b$10$VTjQH1KkpifyV7wDrQUn4e22c006qBsvEIzJ1QsqALVVdY95LlLAe', 'נוף הרים בדפנה', '306559', '638851', 'https://mountain-view-dafna.co.il', '+972528676516'),
  ('user_2', 'owner2@example.com', '$2b$10$VTjQH1KkpifyV7wDrQUn4e22c006qBsvEIzJ1QsqALVVdY95LlLAe', 'יחידה 2', '123456', '789012', '', ''),
  ('user_3', 'owner3@example.com', '$2b$10$VTjQH1KkpifyV7wDrQUn4e22c006qBsvEIzJ1QsqALVVdY95LlLAe', 'יחידה 3', '111111', '222222', '', '')
ON CONFLICT (id) DO NOTHING;
