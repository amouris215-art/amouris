import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = "postgresql://postgres.hbdrszzyuozgcxofpfun:Aa123456789..123.@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

const sql = `
-- ============================================================
-- FONCTIONS RPC POUR DÉDUCTION DE STOCK
-- ============================================================

CREATE OR REPLACE FUNCTION deduct_stock_grams(
  p_product_id UUID,
  p_grams NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock_grams = GREATEST(0, stock_grams - p_grams)
  WHERE id = p_product_id;
END;
$$;

CREATE OR REPLACE FUNCTION deduct_variant_stock(
  p_variant_id UUID,
  p_units INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE flacon_variants
  SET stock_units = GREATEST(0, stock_units - p_units)
  WHERE id = p_variant_id;
END;
$$;

-- ============================================================
-- SUPPRIMER ET RECRÉER TOUTES LES POLICIES RLS
-- ============================================================

-- Products
DROP POLICY IF EXISTS "anon_read_active_products" ON products;
DROP POLICY IF EXISTS "admin_write_products" ON products;
DROP POLICY IF EXISTS "admin_read_all_products" ON products;

CREATE POLICY "anon_read_active_products" ON products
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "admin_all_products" ON products
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Categories
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
DROP POLICY IF EXISTS "admin_write_categories" ON categories;

CREATE POLICY "anon_read_categories" ON categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_categories" ON categories
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Brands
DROP POLICY IF EXISTS "anon_read_brands" ON brands;
DROP POLICY IF EXISTS "admin_write_brands" ON brands;

CREATE POLICY "anon_read_brands" ON brands
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_brands" ON brands
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Collections
DROP POLICY IF EXISTS "anon_read_collections" ON collections;
DROP POLICY IF EXISTS "admin_write_collections" ON collections;

CREATE POLICY "anon_read_collections" ON collections
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_collections" ON collections
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Tags
DROP POLICY IF EXISTS "anon_read_tags" ON tags;
DROP POLICY IF EXISTS "admin_write_tags" ON tags;

CREATE POLICY "anon_read_tags" ON tags
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_tags" ON tags
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Product Tags
DROP POLICY IF EXISTS "anon_read_product_tags" ON product_tags;
DROP POLICY IF EXISTS "admin_write_product_tags" ON product_tags;

CREATE POLICY "anon_read_product_tags" ON product_tags
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_product_tags" ON product_tags
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Flacon Variants
DROP POLICY IF EXISTS "anon_read_variants" ON flacon_variants;
DROP POLICY IF EXISTS "admin_write_variants" ON flacon_variants;

CREATE POLICY "anon_read_variants" ON flacon_variants
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_variants" ON flacon_variants
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Orders
DROP POLICY IF EXISTS "allow_insert_orders" ON orders;
DROP POLICY IF EXISTS "customer_read_own_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;

CREATE POLICY "allow_insert_orders" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "customer_read_own_orders" ON orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "admin_all_orders" ON orders
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Order Items
DROP POLICY IF EXISTS "allow_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "customer_read_order_items" ON order_items;

CREATE POLICY "allow_insert_order_items" ON order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "read_order_items" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR is_admin())
    )
  );

-- Order Status History
DROP POLICY IF EXISTS "allow_insert_status_history" ON order_status_history;

CREATE POLICY "allow_insert_status_history" ON order_status_history
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "read_status_history" ON order_status_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND (orders.customer_id = auth.uid() OR is_admin())
    )
  );

-- Announcements
DROP POLICY IF EXISTS "anon_read_active_announcements" ON announcements;
DROP POLICY IF EXISTS "admin_write_announcements" ON announcements;

CREATE POLICY "anon_read_announcements" ON announcements
  FOR SELECT TO anon, authenticated USING (is_active = true OR is_admin());

CREATE POLICY "admin_all_announcements" ON announcements
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Settings
DROP POLICY IF EXISTS "public_read_settings" ON settings;
DROP POLICY IF EXISTS "admin_write_settings" ON settings;

CREATE POLICY "anon_read_settings" ON settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_all_settings" ON settings
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Profiles
DROP POLICY IF EXISTS "own_profile_read" ON profiles;
DROP POLICY IF EXISTS "own_profile_update" ON profiles;
DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;

CREATE POLICY "own_profile_read" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "own_profile_update" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- AJOUTER LE TYPE ACCESSORY SI MANQUANT
-- ============================================================

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_product_type_check;

ALTER TABLE products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('perfume', 'flacon', 'accessory'));
`;

const checkSql = `
-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================

SELECT 'products' AS table_name, COUNT(*) AS row_count FROM products
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'brands', COUNT(*) FROM brands
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'flacon_variants', COUNT(*) FROM flacon_variants
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;
`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database.");
    
    console.log("Executing SQL setup...");
    await client.query(sql);
    console.log("Setup SQL executed successfully.");
    
    console.log("Running verification query...");
    const res = await client.query(checkSql);
    console.table(res.rows);
  } catch (error) {
    console.error("Error executing SQL:", error);
  } finally {
    await client.end();
    console.log("Disconnected.");
  }
}

main();
