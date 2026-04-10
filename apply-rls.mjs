import pg from 'pg';
const { Client } = pg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DIRECT_URL or DATABASE_URL');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = `
-- SECTION 4.2: Public read policies
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "public_read_categories" ON categories;
DROP POLICY IF EXISTS "public_read_brands" ON brands;
DROP POLICY IF EXISTS "public_read_collections" ON collections;
DROP POLICY IF EXISTS "public_read_tags" ON tags;
DROP POLICY IF EXISTS "public_read_product_tags" ON product_tags;
DROP POLICY IF EXISTS "public_read_variants" ON flacon_variants;
DROP POLICY IF EXISTS "public_read_active_announcements" ON announcements;
DROP POLICY IF EXISTS "public_read_catalogues" ON catalogues;
DROP POLICY IF EXISTS "public_read_settings" ON settings;

-- Recréer les policies correctement
CREATE POLICY "anon_read_active_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "anon_read_categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_brands"
  ON brands FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_collections"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_product_tags"
  ON product_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_flacon_variants"
  ON flacon_variants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_active_announcements"
  ON announcements FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "anon_read_catalogues"
  ON catalogues FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_settings"
  ON settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- SECTION 4.3: Admin policies
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "admin_write_products" ON products;
CREATE POLICY "admin_write_products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_categories" ON categories;
CREATE POLICY "admin_write_categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_brands" ON brands;
CREATE POLICY "admin_write_brands"
  ON brands FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_collections" ON collections;
CREATE POLICY "admin_write_collections"
  ON collections FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_tags" ON tags;
CREATE POLICY "admin_write_tags"
  ON tags FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_product_tags" ON product_tags;
CREATE POLICY "admin_write_product_tags"
  ON product_tags FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_variants" ON flacon_variants;
CREATE POLICY "admin_write_variants"
  ON flacon_variants FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_write_announcements" ON announcements;
CREATE POLICY "admin_write_announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_all_products" ON products;
DROP POLICY IF EXISTS "admin_read_all_products" ON products;
CREATE POLICY "admin_read_all_products"
  ON products FOR SELECT
  TO authenticated
  USING (is_admin());
`;

async function apply() {
  await client.connect();
  console.log('Connected to DB');
  try {
    await client.query(sql);
    console.log('RLS policies and is_admin function Applied Successfully');
  } catch (err) {
    console.error('Error applying SQL:', err);
  } finally {
    await client.end();
  }
}

apply();
