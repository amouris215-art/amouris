-- Migration: Create Settings and Order History Tables
-- 1. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name_fr TEXT DEFAULT 'Amouris Parfums',
    store_name_ar TEXT DEFAULT 'أموريس للعطور',
    slogan_fr TEXT DEFAULT 'L''essence du luxe — Huiles et flacons d''exception',
    slogan_ar TEXT DEFAULT 'جوهر الفخامة — زيوت وقوارير استثنائية',
    email TEXT DEFAULT 'contact@amouris-parfums.com',
    phone TEXT DEFAULT '+213 550 00 00 00',
    address TEXT DEFAULT 'Quartier El Yasmine, Alger',
    wilaya TEXT DEFAULT 'Alger',
    instagram TEXT DEFAULT '',
    facebook TEXT DEFAULT '',
    free_delivery_threshold DECIMAL(10,2) DEFAULT 50000,
    alert_stock_perfume DECIMAL(10,2) DEFAULT 500,
    alert_stock_flacon INTEGER DEFAULT 10,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert a single row if not exists
INSERT INTO public.settings (id) 
SELECT '00000000-0000-0000-0000-000000000001'::UUID
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- 2. Order Status History Table
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    changed_at TIMESTAMPTZ DEFAULT now()
);

-- Add triggers for updated_at if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_settings_updated_at') THEN
        CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
