-- User profiles table with expiry-based access
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Only admins can insert
CREATE POLICY "Admins can create user profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Only admins can update
CREATE POLICY "Admins can update user profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Only admins can delete
CREATE POLICY "Admins can delete user profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');
