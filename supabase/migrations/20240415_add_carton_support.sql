-- Add carton support to flacon_variants
ALTER TABLE public.flacon_variants 
ADD COLUMN IF NOT EXISTS carton_quantity INTEGER,
ADD COLUMN IF NOT EXISTS carton_price DECIMAL(10,2);

-- Update existing records set to NULL by default (already handled by ADD COLUMN)
