-- ══════════════════════════════════════════════════════════════════════════
-- COMPREHENSIVE STORAGE & PERMISSIONS REFRESH
-- ══════════════════════════════════════════════════════════════════════════

-- 1. Ensure all buckets are public
UPDATE storage.buckets SET public = true WHERE id IN ('products', 'brands', 'collections', 'categories', 'catalogues');

-- 2. Clean up existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Storage Catalogues" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Catalogues" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Catalogues" ON storage.objects;

-- 3. Create a unified PUBLIC READ policy for all relevant buckets
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id IN ('products', 'brands', 'collections', 'categories', 'catalogues'));

-- 4. Create a unified ADMIN INSERT policy
-- Allows authenticated users (admins) to upload to any of these buckets
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id IN ('products', 'brands', 'collections', 'categories', 'catalogues'));

-- 5. Create a unified ADMIN UPDATE policy
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id IN ('products', 'brands', 'collections', 'categories', 'catalogues'));

-- 6. Create a unified ADMIN DELETE policy
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id IN ('products', 'brands', 'collections', 'categories', 'catalogues'));

-- 7. Ensure RLS is enabled on storage.objects (it is by default, but let's be sure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
