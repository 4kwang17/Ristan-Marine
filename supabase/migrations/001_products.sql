-- Products table for Ristan Marine catalog
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  item_name_kr TEXT,
  item_name_en TEXT,
  item_name_cn TEXT,
  item_name_ru TEXT,
  item_name_sp TEXT,
  item_name_jp TEXT,
  item_name_es TEXT,
  item_name_hi TEXT,
  impa_code TEXT,
  issa_code TEXT,
  remark TEXT,
  unit TEXT,
  price_krw REAL,
  image TEXT,
  brand TEXT,
  country_of_origin TEXT,
  category TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_impa ON products(impa_code);
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products USING gin(to_tsvector('english', COALESCE(item_name_en,'')));
CREATE INDEX IF NOT EXISTS idx_products_name_kr ON products USING gin(to_tsvector('simple', COALESCE(item_name_kr,'')));

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- All authenticated users can SELECT
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can INSERT/UPDATE/DELETE
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');
