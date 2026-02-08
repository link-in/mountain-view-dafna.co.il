-- Create bookings table to store all bookings from BEDS24
-- This allows us to cross-reference reviews with guest names

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- BEDS24 identifiers
  booking_id TEXT UNIQUE NOT NULL,
  reference TEXT,
  confirmation_code TEXT,
  property_id TEXT,
  room_id TEXT,
  
  -- Guest information
  first_name TEXT,
  last_name TEXT,
  guest_name TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN first_name IS NOT NULL AND last_name IS NOT NULL 
      THEN first_name || ' ' || last_name
      WHEN first_name IS NOT NULL 
      THEN first_name
      ELSE 'Guest'
    END
  ) STORED,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  
  -- Booking details
  arrival DATE,
  departure DATE,
  num_adults INTEGER,
  num_children INTEGER,
  status TEXT,
  
  -- Pricing
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'ILS',
  
  -- Channel info
  channel TEXT, -- 'airbnb', 'booking', 'direct', etc.
  
  -- Raw data from BEDS24
  raw_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX idx_bookings_reference ON bookings(reference);
CREATE INDEX idx_bookings_confirmation_code ON bookings(confirmation_code);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_arrival ON bookings(arrival DESC);
CREATE INDEX idx_bookings_channel ON bookings(channel);
CREATE INDEX idx_bookings_property_room ON bookings(property_id, room_id);

-- Full-text search on guest names
CREATE INDEX idx_bookings_guest_search ON bookings USING gin(
  to_tsvector('simple', COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') || ' ' || COALESCE(email, ''))
);

-- RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read bookings
CREATE POLICY "Allow authenticated users to read bookings"
  ON bookings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage bookings
CREATE POLICY "Allow authenticated users to manage bookings"
  ON bookings
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE bookings IS 'Stores all bookings from BEDS24 for analytics and cross-referencing with reviews';
COMMENT ON COLUMN bookings.booking_id IS 'BEDS24 booking ID (unique identifier)';
COMMENT ON COLUMN bookings.reference IS 'Booking reference code (may contain Airbnb confirmation codes)';
COMMENT ON COLUMN bookings.guest_name IS 'Auto-generated from first_name and last_name';
COMMENT ON COLUMN bookings.raw_data IS 'Full booking data from BEDS24 API';
