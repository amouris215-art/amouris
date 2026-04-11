-- ══════════════════════════════════════════════════
-- AJOUT DES ACCESSOIRES & OUTILS AU CATALOGUE AMOURIS
-- ══════════════════════════════════════════════════

-- 1. Mise à jour de la contrainte product_type pour inclure 'accessory'
DO $$ 
BEGIN 
    -- On tente de supprimer l'ancienne contrainte (nom fréquent dans Supabase/Postgres)
    ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_product_type_check;
    
    -- On ajoute la nouvelle contrainte incluant 'accessory'
    ALTER TABLE public.products 
    ADD CONSTRAINT products_product_type_check 
    CHECK (product_type IN ('perfume', 'flacon', 'accessory'));
EXCEPTION
    WHEN undefined_object THEN 
        RAISE NOTICE 'Constraint not found, skipping drop.';
END $$;

-- 2. Récupération de l'ID de la catégorie Accessoires
DO $$
DECLARE
    cat_id UUID;
    tag_id UUID;
    brand_id TEXT := 'br-10'; -- Paris Corner ou autre marque par défaut
BEGIN
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'accessoires' LIMIT 1;
    SELECT id INTO tag_id FROM public.tags WHERE slug = 'professionnel' LIMIT 1;

    -- Si la catégorie n'existe pas, on la crée (sécurité)
    IF cat_id IS NULL THEN
        INSERT INTO public.categories (name_fr, name_ar, slug)
        VALUES ('Accessoires', 'إكسسوارات', 'accessoires')
        RETURNING id INTO cat_id;
    END IF;

    -- === PRODUIT 1: ENTONNOIR INOX ===
    INSERT INTO public.products (product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, images, status)
    VALUES (
        'accessory', 
        'Entonnoir de précision (Inox)', 
        'قمع دقيق (ستانلس ستيل)', 
        'entonnoir-inox-precision', 
        'Entonnoir professionnel en acier inoxydable de haute qualité. Idéal pour le transfert précis des huiles de parfum sans perte.', 
        'قمع احترافي مصنوع من الفولاذ المقاوم للصدأ عالي الجودة. مثالي لنقل زيوت العطور بدقة دون ضياع.', 
        cat_id, 
        850, 
        ARRAY['/images/products/entonnoir-inox.webp'], 
        'active'
    );

    -- === PRODUIT 2: LOT PIPETTES ===
    INSERT INTO public.products (product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, images, status)
    VALUES (
        'accessory', 
        'Lot de 10 Pipettes (3ml)', 
        'طقم 10 ماصات (3 مل)', 
        'lot-10-pipettes-3ml', 
        'Lot de 10 pipettes graduées en polypropylène. Indispensables pour le dosage précis de vos mélanges et créations.', 
        'طقم 10 ماصات مدرجة من البولي بروبلين. ضرورية للجرعات الدقيقة لخلطاتكم وإبداعاتكم.', 
        cat_id, 
        450, 
        ARRAY['/images/products/pipettes-3ml.webp'], 
        'active'
    );

    -- === PRODUIT 3: MOUILLETTES ===
    INSERT INTO public.products (product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, images, status)
    VALUES (
        'accessory', 
        'Touche à sentir / Mouillettes (100pcs)', 
        'ورق اختبار شم العطور (100 قطعة)', 
        'mouillettes-test-100pcs', 
        'Cartes de test de qualité professionnelle. Excellente rétention du parfum pour une évaluation olfactive précise.', 
        'بطاقات اختبار ذات جودة احترافية. احتفاظ ممتاز بالعطر لتقييم رائحة دقيق.', 
        cat_id, 
        1200, 
        ARRAY['/images/products/mouillettes-test.webp'], 
        'active'
    );

    -- === PRODUIT 4: BALANCE DIGITALE ===
    INSERT INTO public.products (product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, images, status)
    VALUES (
        'accessory', 
        'Balance de précision (0.01g)', 
        'ميزان دقيق (0.01 جم)', 
        'balance-precision-001g', 
        'Balance digitale haute précision pour la formulation de parfums. Capacité jusqu''à 500g, précision 0.01g.', 
        'ميزان رقمي عالي الدقة لتركيب العطور. سعة تصل إلى 500 جم، دقة 0.01 جم.', 
        cat_id, 
        3500, 
        ARRAY['/images/products/balance-precision.webp'], 
        'active'
    );

    -- === PRODUIT 5: SAC VELOURS ===
    INSERT INTO public.products (product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, images, status)
    VALUES (
        'accessory', 
        'Sac Cadeau Velours Amouris', 
        'حقيبة هدايا أموريس مخملية', 
        'sac-cadeau-velours-amouris', 
        'Pochette en velours premium vert émeraude avec cordon doré. Idéal pour présenter vos flacons de parfum en cadeau.', 
        'حقيبة عطر برباط ذهبي من المخمل الفاخر باللون الأخضر الزمردي. مثالية لتقديم زجاجات العطور الخاصة بك كهدية.', 
        cat_id, 
        250, 
        ARRAY['/images/products/sac-velours.webp'], 
        'active'
    );

    -- Ajout des variantes (obligatoires pour le fonctionnement du panier)
    INSERT INTO public.flacon_variants (product_id, size_ml, color, color_name, shape, price, stock_units)
    SELECT id, 0, '#FFFFFF', 'Standard', 'N/A', 850, 100 FROM public.products WHERE slug = 'entonnoir-inox-precision';
    
    INSERT INTO public.flacon_variants (product_id, size_ml, color, color_name, shape, price, stock_units)
    SELECT id, 0, '#FFFFFF', 'Lot de 10', 'N/A', 450, 200 FROM public.products WHERE slug = 'lot-10-pipettes-3ml';
    
    INSERT INTO public.flacon_variants (product_id, size_ml, color, color_name, shape, price, stock_units)
    SELECT id, 0, '#FFFFFF', 'Paquet 100pcs', 'N/A', 1200, 150 FROM public.products WHERE slug = 'mouillettes-test-100pcs';
    
    INSERT INTO public.flacon_variants (product_id, size_ml, color, color_name, shape, price, stock_units)
    SELECT id, 0, '#C0C0C0', 'Argent', 'Digital', 3500, 50 FROM public.products WHERE slug = 'balance-precision-001g';
    
    INSERT INTO public.flacon_variants (product_id, size_ml, color, color_name, shape, price, stock_units)
    SELECT id, 0, '#004d40', 'Vert Émeraude', 'Standard', 250, 500 FROM public.products WHERE slug = 'sac-cadeau-velours-amouris';

    -- Ajout du tag 'Professionnel' si disponible
    IF tag_id IS NOT NULL THEN
        INSERT INTO public.product_tags (product_id, tag_id)
        SELECT id, tag_id FROM public.products WHERE product_type = 'accessory';
    END IF;

END $$;
