-- ═══════════════════════════════════════
-- NETTOYAGE (attention : supprime tout !)
-- ═══════════════════════════════════════
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE product_tags CASCADE;
TRUNCATE TABLE flacon_variants CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE tags CASCADE;
TRUNCATE TABLE collections CASCADE;
TRUNCATE TABLE brands CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE announcements CASCADE;

-- ═══════════════════════════════════════
-- CATÉGORIES (10)
-- ═══════════════════════════════════════
INSERT INTO categories (id, name_fr, name_ar, slug) VALUES
  ('7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 'Oud',        'عود',     'oud'),
  ('6889ad1c-f5e1-48c9-a6d5-afb8bc29436a', 'Floral',     'زهري',    'floral'),
  ('fef8653e-7859-476f-b7d3-a958fc447ca8', 'Oriental',   'شرقي',    'oriental'),
  ('1f77b816-8ef9-4e9b-8393-7c179f3f0d9c', 'Frais',      'منعش',    'frais'),
  ('3aa5bbae-17d8-4b55-8f5d-0bd63d75d824', 'Boisé',      'خشبي',    'boise'),
  ('dbd4174f-d377-4193-8da3-abfa68c007fa', 'Musqué',     'مسكي',    'musque'),
  ('cac9f14f-b47e-4a3f-804c-b19ab96fa7a4', 'Épicé',      'بهاري',   'epice'),
  ('7dc1d178-f2c4-454c-acdd-4070895d5c69', 'Citrus',     'حمضي',    'citrus'),
  ('6bb2ae37-54e7-4faf-a69f-37e362e878f8', 'Aquatique',  'مائي',    'aquatique'),
  ('82b9b38a-a17c-4ab8-8e83-9dee47efbf77', 'Ambré',      'عنبري',   'ambre');

-- ═══════════════════════════════════════
-- MARQUES (10)
-- ═══════════════════════════════════════
INSERT INTO brands (id, name, name_ar, description_fr) VALUES
  ('49c711b6-2650-4eb0-aa32-7ddc1cfa62b9', 'Al Haramain',    'الحرمين',      'Maison de parfumerie orientale fondée à La Mecque.'),
  ('09cd82bc-4a20-42a5-ab90-786fd9c62973', 'Amouage',        'عمواج',         'La marque de luxe du Sultanat d''Oman.'),
  ('986c761e-f546-4665-9435-7a7f6481cbc6', 'Lattafa',        'لطافة',         'Parfums arabes premium accessibles.'),
  ('2880c877-69ab-4c6a-85b1-ff4701042e4d', 'Maison Tahara',  'ميزون طهارة',  'Élégance française et âme orientale.'),
  ('cae9440e-d5ed-423b-abcc-7bb9d7c475a5', 'Rasasi',         'رصاصي',         'Parfumerie de Dubaï depuis 1979.'),
  ('48b1389f-f762-4470-9ff4-0cc5209bab76', 'Swiss Arabian',  'سويس عربيان',  'La rencontre de l''Orient et de l''Occident.'),
  ('2ec8dd03-f720-4170-8f02-a743db4ffa3b', 'Ajmal',          'أجمل',          'Une des plus anciennes maisons de parfumerie du Golfe.'),
  ('36ce1120-454e-4949-b92c-278ad5993ba7', 'Armaf',          'أرماف',         'Parfums de luxe à prix accessible.'),
  ('d6f02679-21ed-4ea5-bc96-8c9a0e10c372', 'Oud Milano',     'عود ميلانو',   'Fusion Orient-Italie, qualité premium.'),
  ('351de08a-edfd-4edb-a6ab-d3d1a91249c7', 'Paris Corner',   'باريس كورنر',  'Inspirations haute couture françaises.');

-- ═══════════════════════════════════════
-- COLLECTIONS (10)
-- ═══════════════════════════════════════
INSERT INTO collections (id, name_fr, name_ar, description_fr) VALUES
  ('0cf0895b-a6df-4fd4-a272-d7c9961f497f', 'Collection Royale',    'المجموعة الملكية',   'Les essences les plus précieuses, dignes des rois.'),
  ('403ab04e-27fd-4c46-a2fe-eb06097742f9', 'Été Arabe',            'الصيف العربي',        'Légèreté et fraîcheur pour les longues journées d''été.'),
  ('e410cbd6-613a-4c51-9661-882cbb8a7dbd', 'Nuit de Sahara',       'ليلة الصحراء',        'Profondeur et mystère inspirés du désert algérien.'),
  ('6870dccd-fef6-4b4d-8ff3-0d42951ee7e6', 'Prestige',             'بريستيج',             'Notre sélection premium, pour les exigeants.'),
  ('f7d1d02e-4495-4467-bb18-0e96142ac22f', 'Bakhoor Heritage',     'تراث البخور',         'L''art ancestral du bakhoor sublimé en huile.'),
  ('ba357403-4a1d-4fd2-b1db-bd599e13c340', 'Oud Signature',        'توقيع العود',         'La quintessence de l''oud, sous toutes ses formes.'),
  ('1f7d6360-43e5-4386-b163-dfe719deb4f0', 'Fleurs d''Orient',     'أزهار الشرق',         'Les fleurs les plus rares de la péninsule arabique.'),
  ('9e83342c-a54a-4f1c-8e4e-c62a3be353fd', 'Masculin Intense',     'رجولي مكثف',          'Compositions intenses et affirmées pour homme.'),
  ('26cbf9a8-08d2-487d-b387-25a22bc917ca', 'Féminité Dorée',       'أنوثة ذهبية',         'Douceur, fleur et musc pour elle.'),
  ('2ee75b1d-0a69-4689-8b03-bae694fc6fac', 'Zen & Méditation',     'زن وتأمل',            'Sérénité, sandalwood et notes apaisantes.');

-- ═══════════════════════════════════════
-- WOSSOUM / TAGS (10)
-- ═══════════════════════════════════════
INSERT INTO tags (id, name_fr, name_ar, slug, show_on_homepage, homepage_order) VALUES
  ('11a638c2-2c5d-4d42-a439-d2d115b549cf', 'Arrivage',          'وصل جديد',         'arrivage',        true,  1),
  ('c4e90d18-2ae0-463e-a274-6eb4e90f1b37', 'Best-seller',       'الأكثر مبيعاً',    'best-seller',     true,  2),
  ('55784525-e7b7-4242-99a8-2373b9c44105', 'Premium',           'مميز',              'premium',         true,  3),
  ('3926c65d-8307-45eb-b228-97b7965ffd0b', 'Offre spéciale',    'عرض خاص',          'offre-speciale',  false, 4),
  ('5cbc244d-3059-4d51-bee0-cfc3cca9b7d2', 'Exclusif',          'حصري',              'exclusif',        false, 5),
  ('be290859-3091-44a2-8091-a44b687d3009', 'Saisonnier',        'موسمي',             'saisonnier',      false, 6),
  ('e113766f-0daf-407c-9c41-400394761e9a', 'Coup de cœur',      'المفضل',            'coup-de-coeur',   false, 7),
  ('3d640837-9b2c-4d0d-bfd4-aa768cc6e068', 'Nouveauté',         'جديد',              'nouveaute',       false, 8),
  ('4dfffc43-7d8f-42b0-ac1b-a0bf2d8ddddd', 'Limité',            'محدود',             'limite',          false, 9),
  ('be598a12-d093-48c9-9e68-7b2192deb37e', 'Professionnel',     'مهني',              'professionnel',   false, 10);

-- ═══════════════════════════════════════
-- PARFUMS (10)
-- ═══════════════════════════════════════
INSERT INTO products (id, product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, brand_id, collection_id, price_per_gram, stock_grams, status) VALUES
  ('a6f96d62-5973-4850-a3c3-eebfb1f48649', 'perfume', 'Rose du Taif',       'وردة الطائف',      'rose-du-taif',
   'Une huile de parfum envoûtante aux notes de rose de Taïf, oud blanc et musc rare.',
   'زيت عطري فاتن بنفحات وردة الطائف والعود الأبيض والمسك النادر.',
   '6889ad1c-f5e1-48c9-a6d5-afb8bc29436a', '49c711b6-2650-4eb0-aa32-7ddc1cfa62b9', '1f7d6360-43e5-4386-b163-dfe719deb4f0', 850,  5000, 'active'),

  ('e0e96b01-d76a-4cd9-9b5f-5bd95e558d67', 'perfume', 'Oud Malaki',         'عود ملكي',          'oud-malaki',
   'L''oud royal dans toute sa splendeur. Profond, chaleureux, impérial.',
   'العود الملكي في كامل روعته. عميق، دافئ، فاخر.',
   '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', '09cd82bc-4a20-42a5-ab90-786fd9c62973', '0cf0895b-a6df-4fd4-a272-d7c9961f497f', 1200, 3000, 'active'),

  ('066bf977-aa9c-499b-a19a-2a201978170c', 'perfume', 'Jasmin Sauvage',     'ياسمين بري',        'jasmin-sauvage',
   'Jasmin blanc intense capturé à l''aurore. Frais, floral, addictif.',
   'ياسمين أبيض مكثف يُقطف عند الفجر. منعش، زهري، مُدمِن.',
   '6889ad1c-f5e1-48c9-a6d5-afb8bc29436a', '2880c877-69ab-4c6a-85b1-ff4701042e4d', '403ab04e-27fd-4c46-a2fe-eb06097742f9', 650,  4500, 'active'),

  ('cc85fd4d-2760-431c-9526-7791fdb6c7f4', 'perfume', 'Ambre Noir',         'عنبر أسود',         'ambre-noir',
   'Un ambre mystérieux aux accords de bois précieux et de vanille noire.',
   'عنبر غامض بمزيج الأخشاب النفيسة والفانيلا السوداء.',
   '82b9b38a-a17c-4ab8-8e83-9dee47efbf77', 'cae9440e-d5ed-423b-abcc-7bb9d7c475a5', 'e410cbd6-613a-4c51-9661-882cbb8a7dbd', 950,  2500, 'active'),

  ('ec3b7954-3a8b-4de9-9cff-5a5ff677c467', 'perfume', 'Musc Tahara',        'مسك طهارة',         'musc-tahara',
   'Musc blanc pur, délicat et soyeux. Une pureté absolue.',
   'مسك أبيض نقي، رقيق وحريري. نقاء مطلق.',
   'dbd4174f-d377-4193-8da3-abfa68c007fa', '2880c877-69ab-4c6a-85b1-ff4701042e4d', '6870dccd-fef6-4b4d-8ff3-0d42951ee7e6', 500,  6000, 'active'),

  ('521f749f-d3e5-423c-8940-ac2d325d9939', 'perfume', 'Bakhoor Al Majd',    'بخور المجد',        'bakhoor-al-majd',
   'L''essence du bakhoor traditionnel en huile concentrée. Un voyage en Orient.',
   'جوهر البخور التقليدي في زيت مركّز. رحلة إلى قلب الشرق.',
   '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', '49c711b6-2650-4eb0-aa32-7ddc1cfa62b9', 'f7d1d02e-4495-4467-bb18-0e96142ac22f', 1100, 2000, 'active'),

  ('2eb11dc7-47b7-46e2-adf4-5c0943d448c0', 'perfume', 'Cedar & Iris',       'سيدار وإيريس',      'cedar-iris',
   'Cèdre du Liban et iris poudré. Élégance boisée intemporelle.',
   'أرز لبنان والإيريس المسحوق. أناقة خشبية خالدة.',
   '3aa5bbae-17d8-4b55-8f5d-0bd63d75d824', '48b1389f-f762-4470-9ff4-0cc5209bab76', '6870dccd-fef6-4b4d-8ff3-0d42951ee7e6', 780,  3500, 'active'),

  ('f0d61a43-35f6-47a4-9238-c84ba110cd72', 'perfume', 'Nuit Orientale',     'ليلة شرقية',        'nuit-orientale',
   'Épices chaudes, santal et oud fumé pour les nuits d''exception.',
   'توابل دافئة وصندل وعود مدخن لليالي الاستثنائية.',
   'fef8653e-7859-476f-b7d3-a958fc447ca8', '986c761e-f546-4665-9435-7a7f6481cbc6', 'e410cbd6-613a-4c51-9661-882cbb8a7dbd', 1050, 1800, 'active'),

  ('c062788c-d722-4da5-9c1f-ebffd35e20bb', 'perfume', 'Patchouli Royal',    'باتشولي ملكي',      'patchouli-royal',
   'Patchouli sombre, cuir et vanille. Un sillage de prestige.',
   'باتشولي داكن، جلد وفانيلا. أثر رائحة يستحق الملوك.',
   'cac9f14f-b47e-4a3f-804c-b19ab96fa7a4', '2ec8dd03-f720-4170-8f02-a743db4ffa3b', '0cf0895b-a6df-4fd4-a272-d7c9961f497f', 920,  2800, 'active'),

  ('b759c181-981c-4d91-87ba-e2d8a3ba5b98', 'perfume', 'Aqua Zafira',        'أكوا زافيرة',       'aqua-zafira',
   'Notes marines, bergamote et muscs blancs. La fraîcheur méditerranéenne.',
   'نفحات بحرية وبرغموت ومسك أبيض. انتعاش البحر الأبيض المتوسط.',
   '6bb2ae37-54e7-4faf-a69f-37e362e878f8', '351de08a-edfd-4edb-a6ab-d3d1a91249c7', '403ab04e-27fd-4c46-a2fe-eb06097742f9', 580,  4000, 'active');

-- ═══════════════════════════════════════
-- TAGS DES PARFUMS
-- ═══════════════════════════════════════
INSERT INTO product_tags (product_id, tag_id) VALUES
  ('a6f96d62-5973-4850-a3c3-eebfb1f48649', '11a638c2-2c5d-4d42-a439-d2d115b549cf'), ('a6f96d62-5973-4850-a3c3-eebfb1f48649', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'),
  ('e0e96b01-d76a-4cd9-9b5f-5bd95e558d67', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'), ('e0e96b01-d76a-4cd9-9b5f-5bd95e558d67', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('066bf977-aa9c-499b-a19a-2a201978170c', '11a638c2-2c5d-4d42-a439-d2d115b549cf'),
  ('cc85fd4d-2760-431c-9526-7791fdb6c7f4', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('ec3b7954-3a8b-4de9-9cff-5a5ff677c467', '11a638c2-2c5d-4d42-a439-d2d115b549cf'), ('ec3b7954-3a8b-4de9-9cff-5a5ff677c467', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'),
  ('521f749f-d3e5-423c-8940-ac2d325d9939', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('2eb11dc7-47b7-46e2-adf4-5c0943d448c0', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'),
  ('f0d61a43-35f6-47a4-9238-c84ba110cd72', '11a638c2-2c5d-4d42-a439-d2d115b549cf'), ('f0d61a43-35f6-47a4-9238-c84ba110cd72', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('c062788c-d722-4da5-9c1f-ebffd35e20bb', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'), ('c062788c-d722-4da5-9c1f-ebffd35e20bb', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('b759c181-981c-4d91-87ba-e2d8a3ba5b98', '11a638c2-2c5d-4d42-a439-d2d115b549cf');

-- ═══════════════════════════════════════
-- FLACONS (10) + VARIANTES
-- ═══════════════════════════════════════
INSERT INTO products (id, product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, status) VALUES
  ('528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 'flacon', 'Flacon Classique Transparent',  'قارورة كلاسيكية شفافة',   'flacon-classique-transparent',
   'Flacon en verre épais, bouchon doré. Design intemporel et élégant.',
   'قارورة زجاج سميك، سدادة ذهبية. تصميم خالد وأنيق.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 350, 'active'),

  ('0c593505-da7d-460c-9502-8dce7d07d866', 'flacon', 'Flacon Luxe Noir Atomiseur',    'قارورة فخمة سوداء بخاخ',  'flacon-luxe-noir-atomiseur',
   'Verre teinté noir mat avec atomiseur doré. L''élégance absolue.',
   'زجاج ملون بالأسود المات مع بخاخ ذهبي. الأناقة المطلقة.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 550, 'active'),

  ('1d250bf2-20ee-4739-9c33-e6277febc21e', 'flacon', 'Flacon Oriental Gravé',         'قارورة شرقية منقوشة',     'flacon-oriental-grave',
   'Verre épais avec motifs orientaux gravés. Bouchon métal doré ciselé.',
   'زجاج سميك بنقوش شرقية. سدادة معدنية ذهبية منحوتة.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 890, 'active'),

  ('7c680a84-bc6d-4c68-8d01-597bdc793c0a', 'flacon', 'Mini Flacon Voyage',            'قارورة ميني للسفر',       'mini-flacon-voyage',
   'Format de voyage pratique, parfait pour les petites commandes أو الهدايا.',
   'حجم سفر عملي، مثالي للطلبات الصغيرة أو الهدايا.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 180, 'active'),

  ('e72812cb-9c7d-4a19-9767-5700feb13028', 'flacon', 'Flacon Carré Élégant',          'قارورة مربعة أنيقة',      'flacon-carre-elegant',
   'Design géométrique épuré. Disponible en plusieurs coloris tendance.',
   'تصميم هندسي راقٍ. متوفر بعدة ألوان عصرية.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 420, 'active'),

  ('d0b4f92c-cf2f-406c-adaa-292b39aac60b', 'flacon', 'Flacon Goutte Arabesque',       'قارورة قطرة عربسك',       'flacon-goutte-arabesque',
   'Forme goutte avec motifs arabesques, inspiration orientale pure.',
   'شكل قطرة بنقوش أرابيسك، إلهام شرقي أصيل.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 720, 'active'),

  ('47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 'flacon', 'Flacon Roll-on Pratique',       'قارورة رول أون عملية',    'flacon-roll-on',
   'Roll-on en verre pour application directe. Idéal pour les huiles de parfum.',
   'رول أون زجاجي للتطبيق المباشر. مثالي لزيوت العطور.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 150, 'active'),

  ('b6d77182-021d-49dd-9dde-e81bc0b31573', 'flacon', 'Flacon Prestige Grande Capacité','قارورة بريستيج كبيرة',   'flacon-prestige-grande-capacite',
   'Pour les professionnels exigeants. Verre épais, bouchon métal luxueux.',
   'للمحترفين المتطلبين. زجاج سميك، سدادة معدنية فاخرة.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 1100, 'active'),

  ('3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 'flacon', 'Flacon Bohème Coloré',          'قارورة بوهيم ملونة',      'flacon-boheme-colore',
   'Verre coloré artisanal, chaque pièce est unique. Style bohème chic.',
   'زجاج ملون حرفي، كل قطعة فريدة. أسلوب بوهيمي راقٍ.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 480, 'active'),

  ('9223c6af-88d5-4d77-abd3-e94cea7ceba5', 'flacon', 'Flacon Hexagonal Premium',      'قارورة سداسية بريميوم',   'flacon-hexagonal-premium',
   'Forme hexagonale géométrique, verre épais taillé. Classe absolue.',
   'شكل سداسي هندسي، زجاج سميك مصقول. أناقة فائقة.', '7ad58d98-7a95-424f-8e74-2ccaae3c79dd', 680, 'active');

-- VARIANTES DES FLACONS
INSERT INTO flacon_variants (id, product_id, size_ml, color, shape, price, stock_units) VALUES
  -- flc-01 Classique Transparent
  ('00a28d2d-d7c4-40a5-a5c5-d5a4119a5f00', '528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 30,  '#F8F8FF', 'Carré',            350,  200),
  ('2a85e230-698a-4175-bbff-53381bed90da', '528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 50,  '#F8F8FF', 'Carré',            450,  150),
  ('47c5d636-013e-4e9b-aede-3a12a761157f', '528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 100, '#F8F8FF', 'Carré',            600,  100),

  -- flc-02 Noir Atomiseur
  ('b93ce0ab-d072-4e75-b35d-fdb8c8591862', '0c593505-da7d-460c-9502-8dce7d07d866', 30,  '#1A1A1A', 'Rond',             550,   80),
  ('79e000ac-26fb-47fa-a2f3-01540711d277', '0c593505-da7d-460c-9502-8dce7d07d866', 50,  '#1A1A1A', 'Rond',             750,   60),
  ('75556302-a27c-4c83-bcfa-6c4034d704ed', '0c593505-da7d-460c-9502-8dce7d07d866', 100, '#1A1A1A', 'Rond',             950,   40),
  ('8a1d3553-bd1a-4481-b868-df3152044a42', '0c593505-da7d-460c-9502-8dce7d07d866', 50,  '#1B2A4A', 'Rond',             780,   35),

  -- flc-03 Oriental Gravé
  ('2dbededd-df6d-4fd4-9097-69fc15b9b292', '1d250bf2-20ee-4739-9c33-e6277febc21e', 50,  '#C9A84C', 'Octogonal',        890,   50),
  ('41977bb0-40d9-423b-84e3-941db118d3ff', '1d250bf2-20ee-4739-9c33-e6277febc21e', 100, '#C9A84C', 'Octogonal',       1200,   30),
  ('cd025887-0c32-4794-b013-e047a2814f67', '1d250bf2-20ee-4739-9c33-e6277febc21e', 50,  '#1B4332', 'Octogonal',        920,   45),
  ('03778d49-91ef-437d-8480-aa4e9e10ab43', '1d250bf2-20ee-4739-9c33-e6277febc21e', 100, '#1B4332', 'Octogonal',       1250,   25),

  -- flc-04 Mini Voyage
  ('6357ba7a-d1ae-4556-82b7-9df734c636aa', '7c680a84-bc6d-4c68-8d01-597bdc793c0a', 5,   '#F8F8FF', 'Cylindrique',      180,  500),
  ('8e0b5a51-674e-4d0d-9bf9-95ed91abecfd', '7c680a84-bc6d-4c68-8d01-597bdc793c0a', 10,  '#F8F8FF', 'Cylindrique',      220,  400),
  ('8a2e5c3a-c0df-4213-8d2b-90bf970a8179', '7c680a84-bc6d-4c68-8d01-597bdc793c0a', 5,   '#E8D5B7', 'Cylindrique',      200,  300),

  -- flc-05 Carré Élégant
  ('65e1f6e2-4fac-44e3-8939-071fe057fad8', 'e72812cb-9c7d-4a19-9767-5700feb13028', 30,  '#FFFFFF', 'Carré',            420,  120),
  ('86ee960f-637d-4433-b8a9-4c53e6be6357', 'e72812cb-9c7d-4a19-9767-5700feb13028', 50,  '#FFFFFF', 'Carré',            520,  100),
  ('4e0a6d53-c72e-4526-8e96-e99a6ceff283', 'e72812cb-9c7d-4a19-9767-5700feb13028', 30,  '#8B4513', 'Carré',            440,   80),
  ('d88a06f6-b702-4e24-b215-a8f30e531830', 'e72812cb-9c7d-4a19-9767-5700feb13028', 50,  '#8B4513', 'Carré',            540,   60),
  ('0ef91d67-64f7-49c9-9e02-c307d0d46e20', 'e72812cb-9c7d-4a19-9767-5700feb13028', 30,  '#2C3E50', 'Carré',            450,   70),

  -- flc-06 Goutte Arabesque
  ('1e860f20-dca2-4ae4-9823-6c92f8bafec0', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 50,  '#C9A84C', 'Goutte',           720,   45),
  ('c9fee4eb-b5dc-49d7-8619-cbd2f244a38e', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 100, '#C9A84C', 'Goutte',           980,   30),
  ('9889ce30-a8ad-4b7e-8b01-58c7916a1d7e', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 50,  '#B22222', 'Goutte',           750,   40),
  ('c343b593-a15a-4311-a16b-15734e65e332', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 50,  '#1B4332', 'Goutte',           750,   35),

  -- flc-07 Roll-on
  ('6436e8f5-fbe2-49aa-95b9-86d0af84e118', '47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 6,   '#F8F8FF', 'Roll-on',          150,  600),
  ('0554b3a0-c168-4cf0-9078-19f2170b4503', '47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 10,  '#F8F8FF', 'Roll-on',          190,  500),
  ('a43bf644-940b-496a-894a-b574d7238b0c', '47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 6,   '#1A1A1A', 'Roll-on',          165,  400),

  -- flc-08 Prestige Grande Capacité
  ('1bf828d3-9939-4224-9f14-afcbf8bd5e2a', 'b6d77182-021d-49dd-9dde-e81bc0b31573', 100, '#F8F8FF', 'Carré Biseauté',  1100,   25),
  ('9af0456d-4b5b-4f96-a333-8fbf4f80168f', 'b6d77182-021d-49dd-9dde-e81bc0b31573', 200, '#F8F8FF', 'Carré Biseauté',  1800,   15),
  ('79a33699-eede-42b8-92e6-c26880bda88e', 'b6d77182-021d-49dd-9dde-e81bc0b31573', 100, '#1A1A1A', 'Carré Biseauté',  1150,   20),

  -- flc-09 Bohème Coloré
  ('c940eb10-f2cc-4ef0-a993-1fcd699dc14c', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 30,  '#8B0000', 'Irrégulier',       480,   60),
  ('35855ee3-2db3-4715-b4f3-7498532c7b39', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 30,  '#00695C', 'Irrégulier',       490,   55),
  ('0ffb46d2-d78a-43bd-8484-48f88e83fbdd', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 30,  '#4A0080', 'Irrégulier',       490,   50),
  ('e57a2058-22e5-4c95-be9e-2a99f96cc86a', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 50,  '#C9A84C', 'Irrégulier',       620,   40),

  -- flc-10 Hexagonal
  ('c8aaca09-678b-4a8f-b83d-cd86a6d647f9', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 50,  '#F8F8FF', 'Hexagonal',        680,   70),
  ('3f1530d3-a520-4391-a315-b4973f946e6b', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 100, '#F8F8FF', 'Hexagonal',        950,   50),
  ('65a4c7ed-7e23-412d-8477-441863a5afe8', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 50,  '#1A1A1A', 'Hexagonal',        710,   40),
  ('a631c72b-354b-4dce-aa47-0be7ba163d27', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 100, '#1A1A1A', 'Hexagonal',        980,   30);

-- TAGS DES FLACONS
INSERT INTO product_tags (product_id, tag_id) VALUES
  ('528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', '11a638c2-2c5d-4d42-a439-d2d115b549cf'),
  ('0c593505-da7d-460c-9502-8dce7d07d866', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'), ('0c593505-da7d-460c-9502-8dce7d07d866', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('1d250bf2-20ee-4739-9c33-e6277febc21e', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('7c680a84-bc6d-4c68-8d01-597bdc793c0a', '11a638c2-2c5d-4d42-a439-d2d115b549cf'), ('7c680a84-bc6d-4c68-8d01-597bdc793c0a', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'),
  ('e72812cb-9c7d-4a19-9767-5700feb13028', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'),
  ('d0b4f92c-cf2f-406c-adaa-292b39aac60b', '11a638c2-2c5d-4d42-a439-d2d115b549cf'), ('d0b4f92c-cf2f-406c-adaa-292b39aac60b', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', '11a638c2-2c5d-4d42-a439-d2d115b549cf'), ('47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'),
  ('b6d77182-021d-49dd-9dde-e81bc0b31573', '55784525-e7b7-4242-99a8-2373b9c44105'),
  ('3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', '11a638c2-2c5d-4d42-a439-d2d115b549cf'),
  ('9223c6af-88d5-4d77-abd3-e94cea7ceba5', 'c4e90d18-2ae0-463e-a274-6eb4e90f1b37'), ('9223c6af-88d5-4d77-abd3-e94cea7ceba5', '55784525-e7b7-4242-99a8-2373b9c44105');

-- ═══════════════════════════════════════
-- ANNONCES
-- ═══════════════════════════════════════
INSERT INTO announcements (text_fr, text_ar, is_active, display_order) VALUES
  ('Livraison gratuite pour les commandes de plus de 50 000 DZD', 'توصيل مجاني للطلبات فوق 50,000 دج', true, 1),
  ('Nouveaux arrivages disponibles — Découvrez notre collection Oud Signature', 'وصلت منتجات جديدة — اكتشف مجموعة توقيع العود', true, 2),
  ('Paiement à la livraison dans toutes les 58 wilayas', 'الدفع عند الاستلام في جميع الولايات الـ58', true, 3);
