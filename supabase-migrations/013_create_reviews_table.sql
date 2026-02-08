-- Create reviews table for storing guest reviews from multiple sources
-- This migration adds support for automatic review syncing from BEDS24 (Booking.com, Airbnb) and Google

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  user_image TEXT,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_date TIMESTAMP NOT NULL,
  comment TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('airbnb', 'booking', 'google')),
  host_response TEXT,
  raw_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_reviews_source ON reviews(source);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_active ON reviews(is_active);
CREATE INDEX idx_reviews_date ON reviews(review_date DESC);
CREATE INDEX idx_reviews_external_id ON reviews(external_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active reviews
CREATE POLICY "Allow public read access to active reviews"
  ON reviews
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to manage reviews
CREATE POLICY "Allow authenticated users to manage reviews"
  ON reviews
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE reviews IS 'Stores guest reviews from multiple sources (BEDS24 Booking.com, Airbnb, Google)';
COMMENT ON COLUMN reviews.external_id IS 'Unique identifier from the external source to prevent duplicates';
COMMENT ON COLUMN reviews.raw_data IS 'Original JSON data from the API for debugging and future reference';
COMMENT ON COLUMN reviews.is_active IS 'Flag to hide reviews without deleting them';
