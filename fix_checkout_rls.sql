-- ======================================================
-- FIX CHECKOUT ISSUES: RLS POLICIES & TABLE NAMES
-- Run this in Supabase SQL Editor
-- ======================================================

-- 1. Check and Rename order_history to order_status_history if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_history') 
       AND NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_status_history') THEN
        ALTER TABLE public.order_history RENAME TO order_status_history;
    END IF;
END $$;

-- 2. Verify or Create order_status_history if it doesn't exist
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Update RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "anyone_insert_order" ON public.orders;
DROP POLICY IF EXISTS "anon_insert_order" ON public.orders;
DROP POLICY IF EXISTS "public_insert_order" ON public.orders;
DROP POLICY IF EXISTS "allow_insert_orders" ON public.orders;

-- Allow guest & authenticated users to create orders
CREATE POLICY "allow_insert_orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Fix SELECT policy for orders: customers see their own, admins see all
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "customer_read_own_orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

CREATE POLICY "customer_read_own_orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid()
    OR (guest_phone IS NOT NULL AND auth.uid() IS NULL) -- Guests see nothing usually without specific session logic, but keeping simple
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Update RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "anyone_insert_items" ON public.order_items;
DROP POLICY IF EXISTS "allow_insert_items" ON public.order_items;

CREATE POLICY "allow_insert_order_items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "customer_read_order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "customer_read_order_items"
  ON public.order_items
  FOR SELECT
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

-- 5. Update RLS on order_status_history
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_insert_history" ON public.order_status_history;
DROP POLICY IF EXISTS "allow_insert_status_history" ON public.order_status_history;

CREATE POLICY "allow_insert_status_history"
  ON public.order_status_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view history" ON public.order_status_history;
DROP POLICY IF EXISTS "customer_read_history" ON public.order_status_history;

CREATE POLICY "customer_read_status_history"
  ON public.order_status_history
  FOR SELECT
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
