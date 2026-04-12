-- Adding description fields to categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Verify columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories';
