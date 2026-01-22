-- Add first_name and last_name to users table
-- Keep display_name for backward compatibility

ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Create index for searching
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);
CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name);

-- Optional: Migrate existing display_name to first_name if needed
-- UPDATE users 
-- SET first_name = display_name 
-- WHERE first_name IS NULL AND display_name IS NOT NULL;

COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';
COMMENT ON COLUMN users.display_name IS 'Full display name (for backward compatibility)';

-- Done!
SELECT 'Added first_name and last_name columns successfully!' AS result;
