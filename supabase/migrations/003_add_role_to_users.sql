-- Add role column to users table for admin access control
-- Role can be: 'admin' or 'owner' (default)

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'owner' 
CHECK (role IN ('admin', 'owner'));

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update existing admin user (update the email to your actual admin email)
-- You can change this email after running the migration
UPDATE users 
SET role = 'admin' 
WHERE email = 'owner1@example.com';

-- Add comment for documentation
COMMENT ON COLUMN users.role IS 'User role: admin for system administrators, owner for property owners';
