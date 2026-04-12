-- ENSURE STORAGE BUCKETS ARE PUBLIC AND ACCESSIBLE
-- Run this in your Supabase SQL Editor if images are not appearing

-- 1. Ensure buckets exist and are public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, '{image/jpeg,image/png,image/webp}'),
  ('brands', 'brands', true, 5242880, '{image/jpeg,image/png,image/webp}'),
  ('collections', 'collections', true, 5242880, '{image/jpeg,image/png,image/webp}'),
  ('categories', 'categories', true, 5242880, '{image/jpeg,image/png,image/webp}')
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow PUBLIC (Anonymous) access to READ images
-- This is crucial for displaying images on the storefront
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('products', 'brands', 'collections', 'categories'));

-- 3. Allow authenticated users to upload (Admin role usually bypasses this via service role, but good to have)
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('products', 'brands', 'collections', 'categories'));

-- 4. Allow authenticated users to delete their images
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;
CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('products', 'brands', 'collections', 'categories'));
