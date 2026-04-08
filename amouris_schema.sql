-- ══════════════════════════════════════════════════
-- SCHEMA COMPLET POUR AMOURIS PARFUMS (SUPABASE)
-- ══════════════════════════════════════════════════

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES DE BASE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    logo_url TEXT,
    description_fr TEXT,
    description_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    cover_image TEXT,
    description_fr TEXT,
    description_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    show_on_homepage BOOLEAN DEFAULT false,
    homepage_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUITS ET VARIANTES
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL CHECK (product_type IN ('perfume', 'flacon')),
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_fr TEXT,
    description_ar TEXT,
    images TEXT[] DEFAULT '{}',
    category_id UUID REFERENCES public.categories(id),
    brand_id UUID REFERENCES public.brands(id),
    collection_id UUID REFERENCES public.collections(id),
    
    -- Pour les parfums (huiles)
    price_per_gram DECIMAL(10,2),
    stock_grams DECIMAL(10,2),
    
    -- Pour les flacons (base price used if no variants, though usually variants override)
    base_price DECIMAL(10,2),
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.flacon_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    size_ml INTEGER NOT NULL,
    color TEXT,
    shape TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_units INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_tags (
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- 4. PROFILS CLIENTS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    shop_name TEXT,
    phone TEXT UNIQUE,
    wilaya TEXT,
    commune TEXT,
    is_frozen BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. COMMANDES
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id),
    
    -- Infos invité (si pas de customer_id)
    guest_first_name TEXT,
    guest_last_name TEXT,
    guest_phone TEXT,
    guest_wilaya TEXT,
    
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
    order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
    
    admin_notes TEXT,
    invoice_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    flacon_variant_id UUID REFERENCES public.flacon_variants(id),
    
    product_name_fr TEXT NOT NULL,
    product_name_ar TEXT NOT NULL,
    
    quantity_grams DECIMAL(10,2), -- Pour les parfums
    quantity_units INTEGER,        -- Pour les flacons
    
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. DIVERS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text_fr TEXT NOT NULL,
    text_ar TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. FONCTIONS ET LOGIQUE MÉTIER

-- Séquence pour les numéros de commande
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Fonction pour obtenir le prochain numéro de commande via RPC
CREATE OR REPLACE FUNCTION next_order_number()
RETURNS INTEGER AS $$
BEGIN
  RETURN nextval('order_number_seq');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
