-- Inquiries table for contact form
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit inquiry"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');
