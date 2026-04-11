-- ======================================================
-- FIX ORDER CREATION: SCHEMA & AUTOMATIC NUMBERS
-- Run this in Supabase SQL Editor to resolve "Order creation failed"
-- ======================================================

-- 1. Ensure Orders Table has all required columns
DO $$ 
BEGIN 
    -- Add is_registered_customer if missing
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'is_registered_customer') THEN
        ALTER TABLE public.orders ADD COLUMN is_registered_customer BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    -- Add guest_commune if missing
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'guest_commune') THEN
        ALTER TABLE public.orders ADD COLUMN guest_commune TEXT;
    END IF;
END $$;

-- 2. Setup Order Number Sequence
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1000;

-- 3. Create/Update Order Number Generation Function
CREATE OR REPLACE FUNCTION public.fn_generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if not provided
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'AM-' || LPAD(nextval('public.order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Apply Trigger (Drop first to avoid duplication)
DROP TRIGGER IF EXISTS trg_orders_number ON public.orders;
CREATE TRIGGER trg_orders_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.fn_generate_order_number();

-- 5. Revise RLS Policies for Orders & Items (Ensure Guest Access)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Orders Creation
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "allow_insert_orders" ON public.orders;
CREATE POLICY "allow_insert_orders" 
    ON public.orders FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- Items Creation
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "allow_insert_order_items" ON public.order_items;
CREATE POLICY "allow_insert_order_items" 
    ON public.order_items FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- History Creation
DROP POLICY IF EXISTS "allow_insert_status_history" ON public.order_status_history;
CREATE POLICY "allow_insert_status_history" 
    ON public.order_status_history FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- 6. Fix profile trigger dependency if necessary (optional safeguard)
-- If orders reference profile_id, ensures null is allowed for guests
ALTER TABLE public.orders ALTER COLUMN customer_id DROP NOT NULL;
