-- ============================================================
-- FIX: Ensure order creation works for all users (guests included)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Ensure order_number trigger exists
CREATE OR REPLACE FUNCTION public.fn_generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'AM-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_orders_number ON public.orders;
CREATE TRIGGER trg_orders_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.fn_generate_order_number();

-- 2. Ensure is_registered_customer column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'is_registered_customer') THEN
        ALTER TABLE public.orders ADD COLUMN is_registered_customer BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'guest_commune') THEN
        ALTER TABLE public.orders ADD COLUMN guest_commune TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'invoice_generated') THEN
        ALTER TABLE public.orders ADD COLUMN invoice_generated BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'invoice_data') THEN
        ALTER TABLE public.orders ADD COLUMN invoice_data JSONB;
    END IF;
END $$;

-- 3. Allow customer_id to be NULL (for guest orders)
ALTER TABLE public.orders ALTER COLUMN customer_id DROP NOT NULL;

-- 4. Ensure order_status_history table exists
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Fix RLS: Allow anonymous + authenticated users to INSERT orders, items, and history

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Orders INSERT
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "allow_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "anyone_insert_order" ON public.orders;
DROP POLICY IF EXISTS "anon_insert_order" ON public.orders;
DROP POLICY IF EXISTS "public_insert_order" ON public.orders;

CREATE POLICY "allow_insert_orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Orders SELECT (keep existing or re-create)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "customer_read_own_orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

CREATE POLICY "customer_read_own_orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Anon can also read their own order (no-op since they don't have uid, but keeps policy clean)
DROP POLICY IF EXISTS "anon_read_orders" ON public.orders;
CREATE POLICY "anon_read_orders"
  ON public.orders FOR SELECT
  TO anon
  USING (false); -- anon users cannot read orders directly

-- Orders UPDATE (admin only)
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order Items INSERT
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "allow_insert_order_items" ON public.order_items;
DROP POLICY IF EXISTS "allow_insert_items" ON public.order_items;

CREATE POLICY "allow_insert_order_items"
  ON public.order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Order Items SELECT
DROP POLICY IF EXISTS "read_order_items" ON public.order_items;
DROP POLICY IF EXISTS "customer_read_order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

CREATE POLICY "read_order_items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.customer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Order Status History
DROP POLICY IF EXISTS "allow_insert_status_history" ON public.order_status_history;
DROP POLICY IF EXISTS "system_insert_history" ON public.order_status_history;

CREATE POLICY "allow_insert_status_history"
  ON public.order_status_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "read_status_history" ON public.order_status_history;
DROP POLICY IF EXISTS "customer_read_status_history" ON public.order_status_history;
DROP POLICY IF EXISTS "Admins can view history" ON public.order_status_history;
DROP POLICY IF EXISTS "customer_read_history" ON public.order_status_history;

CREATE POLICY "read_status_history"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_status_history.order_id
      AND (
        orders.customer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Done! Orders should now work for guests and authenticated users.
