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
  ('cat-01', 'Oud',        'عود',     'oud'),
  ('cat-02', 'Floral',     'زهري',    'floral'),
  ('cat-03', 'Oriental',   'شرقي',    'oriental'),
  ('cat-04', 'Frais',      'منعش',    'frais'),
  ('cat-05', 'Boisé',      'خشبي',    'boise'),
  ('cat-06', 'Musqué',     'مسكي',    'musque'),
  ('cat-07', 'Épicé',      'بهاري',   'epice'),
  ('cat-08', 'Citrus',     'حمضي',    'citrus'),
  ('cat-09', 'Aquatique',  'مائي',    'aquatique'),
  ('cat-10', 'Ambré',      'عنبري',   'ambre');

-- ═══════════════════════════════════════
-- MARQUES (10)
-- ═══════════════════════════════════════
INSERT INTO brands (id, name, name_ar, description_fr) VALUES
  ('br-01', 'Al Haramain',    'الحرمين',      'Maison de parfumerie orientale fondée à La Mecque.'),
  ('br-02', 'Amouage',        'عمواج',         'La marque de luxe du Sultanat d''Oman.'),
  ('br-03', 'Lattafa',        'لطافة',         'Parfums arabes premium accessibles.'),
  ('br-04', 'Maison Tahara',  'ميزون طهارة',  'Élégance française et âme orientale.'),
  ('br-05', 'Rasasi',         'رصاصي',         'Parfumerie de Dubaï depuis 1979.'),
  ('br-06', 'Swiss Arabian',  'سويس عربيان',  'La rencontre de l''Orient et de l''Occident.'),
  ('br-07', 'Ajmal',          'أجمل',          'Une des plus anciennes maisons de parfumerie du Golfe.'),
  ('br-08', 'Armaf',          'أرماف',         'Parfums de luxe à prix accessible.'),
  ('br-09', 'Oud Milano',     'عود ميلانو',   'Fusion Orient-Italie, qualité premium.'),
  ('br-10', 'Paris Corner',   'باريس كورنر',  'Inspirations haute couture françaises.');

-- ═══════════════════════════════════════
-- COLLECTIONS (10)
-- ═══════════════════════════════════════
INSERT INTO collections (id, name_fr, name_ar, description_fr) VALUES
  ('col-01', 'Collection Royale',    'المجموعة الملكية',   'Les essences les plus précieuses, dignes des rois.'),
  ('col-02', 'Été Arabe',            'الصيف العربي',        'Légèreté et fraîcheur pour les longues journées d''été.'),
  ('col-03', 'Nuit de Sahara',       'ليلة الصحراء',        'Profondeur et mystère inspirés du désert algérien.'),
  ('col-04', 'Prestige',             'بريستيج',             'Notre sélection premium, pour les exigeants.'),
  ('col-05', 'Bakhoor Heritage',     'تراث البخور',         'L''art ancestral du bakhoor sublimé en huile.'),
  ('col-06', 'Oud Signature',        'توقيع العود',         'La quintessence de l''oud, sous toutes ses formes.'),
  ('col-07', 'Fleurs d''Orient',     'أزهار الشرق',         'Les fleurs les plus rares de la péninsule arabique.'),
  ('col-08', 'Masculin Intense',     'رجولي مكثف',          'Compositions intenses et affirmées pour homme.'),
  ('col-09', 'Féminité Dorée',       'أنوثة ذهبية',         'Douceur, fleur et musc pour elle.'),
  ('col-10', 'Zen & Méditation',     'زن وتأمل',            'Sérénité, sandalwood et notes apaisantes.');

-- ═══════════════════════════════════════
-- WOSSOUM / TAGS (10)
-- ═══════════════════════════════════════
INSERT INTO tags (id, name_fr, name_ar, slug, show_on_homepage, homepage_order) VALUES
  ('tag-01', 'Arrivage',          'وصل جديد',         'arrivage',        true,  1),
  ('tag-02', 'Best-seller',       'الأكثر مبيعاً',    'best-seller',     true,  2),
  ('tag-03', 'Premium',           'مميز',              'premium',         true,  3),
  ('tag-04', 'Offre spéciale',    'عرض خاص',          'offre-speciale',  false, 4),
  ('tag-05', 'Exclusif',          'حصري',              'exclusif',        false, 5),
  ('tag-06', 'Saisonnier',        'موسمي',             'saisonnier',      false, 6),
  ('tag-07', 'Coup de cœur',      'المفضل',            'coup-de-coeur',   false, 7),
  ('tag-08', 'Nouveauté',         'جديد',              'nouveaute',       false, 8),
  ('tag-09', 'Limité',            'محدود',             'limite',          false, 9),
  ('tag-10', 'Professionnel',     'مهني',              'professionnel',   false, 10);

-- ═══════════════════════════════════════
-- PARFUMS (10)
-- ═══════════════════════════════════════
INSERT INTO products (id, product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, brand_id, collection_id, price_per_gram, stock_grams, status) VALUES
  ('prf-01', 'perfume', 'Rose du Taif',       'وردة الطائف',      'rose-du-taif',
   'Une huile de parfum envoûtante aux notes de rose de Taïf, oud blanc et musc rare.',
   'زيت عطري فاتن بنفحات وردة الطائف والعود الأبيض والمسك النادر.',
   'cat-02', 'br-01', 'col-07', 850,  5000, 'active'),

  ('prf-02', 'perfume', 'Oud Malaki',         'عود ملكي',          'oud-malaki',
   'L''oud royal dans toute sa splendeur. Profond, chaleureux, impérial.',
   'العود الملكي في كامل روعته. عميق، دافئ، فاخر.',
   'cat-01', 'br-02', 'col-01', 1200, 3000, 'active'),

  ('prf-03', 'perfume', 'Jasmin Sauvage',     'ياسمين بري',        'jasmin-sauvage',
   'Jasmin blanc intense capturé à l''aurore. Frais, floral, addictif.',
   'ياسمين أبيض مكثف يُقطف عند الفجر. منعش، زهري، مُدمِن.',
   'cat-02', 'br-04', 'col-02', 650,  4500, 'active'),

  ('prf-04', 'perfume', 'Ambre Noir',         'عنبر أسود',         'ambre-noir',
   'Un ambre mystérieux aux accords de bois précieux et de vanille noire.',
   'عنبر غامض بمزيج الأخشاب النفيسة والفانيلا السوداء.',
   'cat-10', 'br-05', 'col-03', 950,  2500, 'active'),

  ('prf-05', 'perfume', 'Musc Tahara',        'مسك طهارة',         'musc-tahara',
   'Musc blanc pur, délicat et soyeux. Une pureté absolue.',
   'مسك أبيض نقي، رقيق وحريري. نقاء مطلق.',
   'cat-06', 'br-04', 'col-04', 500,  6000, 'active'),

  ('prf-06', 'perfume', 'Bakhoor Al Majd',    'بخور المجد',        'bakhoor-al-majd',
   'L''essence du bakhoor traditionnel en huile concentrée. Un voyage en Orient.',
   'جوهر البخور التقليدي في زيت مركّز. رحلة إلى قلب الشرق.',
   'cat-01', 'br-01', 'col-05', 1100, 2000, 'active'),

  ('prf-07', 'perfume', 'Cedar & Iris',       'سيدار وإيريس',      'cedar-iris',
   'Cèdre du Liban et iris poudré. Élégance boisée intemporelle.',
   'أرز لبنان والإيريس المسحوق. أناقة خشبية خالدة.',
   'cat-05', 'br-06', 'col-04', 780,  3500, 'active'),

  ('prf-08', 'perfume', 'Nuit Orientale',     'ليلة شرقية',        'nuit-orientale',
   'Épices chaudes, santal et oud fumé pour les nuits d''exception.',
   'توابل دافئة وصندل وعود مدخن لليالي الاستثنائية.',
   'cat-03', 'br-03', 'col-03', 1050, 1800, 'active'),

  ('prf-09', 'perfume', 'Patchouli Royal',    'باتشولي ملكي',      'patchouli-royal',
   'Patchouli sombre, cuir et vanille. Un sillage de prestige.',
   'باتشولي داكن، جلد وفانيلا. أثر رائحة يستحق الملوك.',
   'cat-07', 'br-07', 'col-01', 920,  2800, 'active'),

  ('prf-10', 'perfume', 'Aqua Zafira',        'أكوا زافيرة',       'aqua-zafira',
   'Notes marines, bergamote et muscs blancs. La fraîcheur méditerranéenne.',
   'نفحات بحرية وبرغموت ومسك أبيض. انتعاش البحر الأبيض المتوسط.',
   'cat-09', 'br-10', 'col-02', 580,  4000, 'active');

-- ═══════════════════════════════════════
-- TAGS DES PARFUMS
-- ═══════════════════════════════════════
INSERT INTO product_tags (product_id, tag_id) VALUES
  ('prf-01', 'tag-01'), ('prf-01', 'tag-02'),
  ('prf-02', 'tag-02'), ('prf-02', 'tag-03'),
  ('prf-03', 'tag-01'),
  ('prf-04', 'tag-03'),
  ('prf-05', 'tag-01'), ('prf-05', 'tag-02'),
  ('prf-06', 'tag-03'),
  ('prf-07', 'tag-02'),
  ('prf-08', 'tag-01'), ('prf-08', 'tag-03'),
  ('prf-09', 'tag-02'), ('prf-09', 'tag-03'),
  ('prf-10', 'tag-01');

-- ═══════════════════════════════════════
-- FLACONS (10) + VARIANTES
-- ═══════════════════════════════════════
INSERT INTO products (id, product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, status) VALUES
  ('flc-01', 'flacon', 'Flacon Classique Transparent',  'قارورة كلاسيكية شفافة',   'flacon-classique-transparent',
   'Flacon en verre épais, bouchon doré. Design intemporel et élégant.',
   'قارورة زجاج سميك، سدادة ذهبية. تصميم خالد وأنيق.', 'cat-01', 350, 'active'),

  ('flc-02', 'flacon', 'Flacon Luxe Noir Atomiseur',    'قارورة فخمة سوداء بخاخ',  'flacon-luxe-noir-atomiseur',
   'Verre teinté noir mat avec atomiseur doré. L''élégance absolue.',
   'زجاج ملون بالأسود المات مع بخاخ ذهبي. الأناقة المطلقة.', 'cat-01', 550, 'active'),

  ('flc-03', 'flacon', 'Flacon Oriental Gravé',         'قارورة شرقية منقوشة',     'flacon-oriental-grave',
   'Verre épais avec motifs orientaux gravés. Bouchon métal doré ciselé.',
   'زجاج سميك بنقوش شرقية. سدادة معدنية ذهبية منحوتة.', 'cat-01', 890, 'active'),

  ('flc-04', 'flacon', 'Mini Flacon Voyage',            'قارورة ميني للسفر',       'mini-flacon-voyage',
   'Format de voyage pratique, parfait pour les petites commandes أو الهدايا.',
   'حجم سفر عملي، مثالي للطلبات الصغيرة أو الهدايا.', 'cat-01', 180, 'active'),

  ('flc-05', 'flacon', 'Flacon Carré Élégant',          'قارورة مربعة أنيقة',      'flacon-carre-elegant',
   'Design géométrique épuré. Disponible en plusieurs coloris tendance.',
   'تصميم هندسي راقٍ. متوفر بعدة ألوان عصرية.', 'cat-01', 420, 'active'),

  ('flc-06', 'flacon', 'Flacon Goutte Arabesque',       'قارورة قطرة عربسك',       'flacon-goutte-arabesque',
   'Forme goutte avec motifs arabesques, inspiration orientale pure.',
   'شكل قطرة بنقوش أرابيسك، إلهام شرقي أصيل.', 'cat-01', 720, 'active'),

  ('flc-07', 'flacon', 'Flacon Roll-on Pratique',       'قارورة رول أون عملية',    'flacon-roll-on',
   'Roll-on en verre pour application directe. Idéal pour les huiles de parfum.',
   'رول أون زجاجي للتطبيق المباشر. مثالي لزيوت العطور.', 'cat-01', 150, 'active'),

  ('flc-08', 'flacon', 'Flacon Prestige Grande Capacité','قارورة بريستيج كبيرة',   'flacon-prestige-grande-capacite',
   'Pour les professionnels exigeants. Verre épais, bouchon métal luxueux.',
   'للمحترفين المتطلبين. زجاج سميك، سدادة معدنية فاخرة.', 'cat-01', 1100, 'active'),

  ('flc-09', 'flacon', 'Flacon Bohème Coloré',          'قارورة بوهيم ملونة',      'flacon-boheme-colore',
   'Verre coloré artisanal, chaque pièce est unique. Style bohème chic.',
   'زجاج ملون حرفي، كل قطعة فريدة. أسلوب بوهيمي راقٍ.', 'cat-01', 480, 'active'),

  ('flc-10', 'flacon', 'Flacon Hexagonal Premium',      'قارورة سداسية بريميوم',   'flacon-hexagonal-premium',
   'Forme hexagonale géométrique, verre épais taillé. Classe absolue.',
   'شكل سداسي هندسي، زجاج سميك مصقول. أناقة فائقة.', 'cat-01', 680, 'active');

-- VARIANTES DES FLACONS
INSERT INTO flacon_variants (id, product_id, size_ml, color, shape, price, stock_units) VALUES
  -- flc-01 Classique Transparent
  ('fv-001', 'flc-01', 30,  '#F8F8FF', 'Carré',            350,  200),
  ('fv-002', 'flc-01', 50,  '#F8F8FF', 'Carré',            450,  150),
  ('fv-003', 'flc-01', 100, '#F8F8FF', 'Carré',            600,  100),

  -- flc-02 Noir Atomiseur
  ('fv-004', 'flc-02', 30,  '#1A1A1A', 'Rond',             550,   80),
  ('fv-005', 'flc-02', 50,  '#1A1A1A', 'Rond',             750,   60),
  ('fv-006', 'flc-02', 100, '#1A1A1A', 'Rond',             950,   40),
  ('fv-007', 'flc-02', 50,  '#1B2A4A', 'Rond',             780,   35),

  -- flc-03 Oriental Gravé
  ('fv-008', 'flc-03', 50,  '#C9A84C', 'Octogonal',        890,   50),
  ('fv-009', 'flc-03', 100, '#C9A84C', 'Octogonal',       1200,   30),
  ('fv-010', 'flc-03', 50,  '#1B4332', 'Octogonal',        920,   45),
  ('fv-011', 'flc-03', 100, '#1B4332', 'Octogonal',       1250,   25),

  -- flc-04 Mini Voyage
  ('fv-012', 'flc-04', 5,   '#F8F8FF', 'Cylindrique',      180,  500),
  ('fv-013', 'flc-04', 10,  '#F8F8FF', 'Cylindrique',      220,  400),
  ('fv-014', 'flc-04', 5,   '#E8D5B7', 'Cylindrique',      200,  300),

  -- flc-05 Carré Élégant
  ('fv-015', 'flc-05', 30,  '#FFFFFF', 'Carré',            420,  120),
  ('fv-016', 'flc-05', 50,  '#FFFFFF', 'Carré',            520,  100),
  ('fv-017', 'flc-05', 30,  '#8B4513', 'Carré',            440,   80),
  ('fv-018', 'flc-05', 50,  '#8B4513', 'Carré',            540,   60),
  ('fv-019', 'flc-05', 30,  '#2C3E50', 'Carré',            450,   70),

  -- flc-06 Goutte Arabesque
  ('fv-020', 'flc-06', 50,  '#C9A84C', 'Goutte',           720,   45),
  ('fv-021', 'flc-06', 100, '#C9A84C', 'Goutte',           980,   30),
  ('fv-022', 'flc-06', 50,  '#B22222', 'Goutte',           750,   40),
  ('fv-023', 'flc-06', 50,  '#1B4332', 'Goutte',           750,   35),

  -- flc-07 Roll-on
  ('fv-024', 'flc-07', 6,   '#F8F8FF', 'Roll-on',          150,  600),
  ('fv-025', 'flc-07', 10,  '#F8F8FF', 'Roll-on',          190,  500),
  ('fv-026', 'flc-07', 6,   '#1A1A1A', 'Roll-on',          165,  400),

  -- flc-08 Prestige Grande Capacité
  ('fv-027', 'flc-08', 100, '#F8F8FF', 'Carré Biseauté',  1100,   25),
  ('fv-028', 'flc-08', 200, '#F8F8FF', 'Carré Biseauté',  1800,   15),
  ('fv-029', 'flc-08', 100, '#1A1A1A', 'Carré Biseauté',  1150,   20),

  -- flc-09 Bohème Coloré
  ('fv-030', 'flc-09', 30,  '#8B0000', 'Irrégulier',       480,   60),
  ('fv-031', 'flc-09', 30,  '#00695C', 'Irrégulier',       490,   55),
  ('fv-032', 'flc-09', 30,  '#4A0080', 'Irrégulier',       490,   50),
  ('fv-033', 'flc-09', 50,  '#C9A84C', 'Irrégulier',       620,   40),

  -- flc-10 Hexagonal
  ('fv-034', 'flc-10', 50,  '#F8F8FF', 'Hexagonal',        680,   70),
  ('fv-035', 'flc-10', 100, '#F8F8FF', 'Hexagonal',        950,   50),
  ('fv-036', 'flc-10', 50,  '#1A1A1A', 'Hexagonal',        710,   40),
  ('fv-037', 'flc-10', 100, '#1A1A1A', 'Hexagonal',        980,   30);

-- TAGS DES FLACONS
INSERT INTO product_tags (product_id, tag_id) VALUES
  ('flc-01', 'tag-01'),
  ('flc-02', 'tag-02'), ('flc-02', 'tag-03'),
  ('flc-03', 'tag-03'),
  ('flc-04', 'tag-01'), ('flc-04', 'tag-02'),
  ('flc-05', 'tag-02'),
  ('flc-06', 'tag-01'), ('flc-06', 'tag-03'),
  ('flc-07', 'tag-01'), ('flc-07', 'tag-02'),
  ('flc-08', 'tag-03'),
  ('flc-09', 'tag-01'),
  ('flc-10', 'tag-02'), ('flc-10', 'tag-03');

-- ═══════════════════════════════════════
-- ANNONCES
-- ═══════════════════════════════════════
INSERT INTO announcements (text_fr, text_ar, is_active, display_order) VALUES
  ('Livraison gratuite pour les commandes de plus de 50 000 DZD', 'توصيل مجاني للطلبات فوق 50,000 دج', true, 1),
  ('Nouveaux arrivages disponibles — Découvrez notre collection Oud Signature', 'وصلت منتجات جديدة — اكتشف مجموعة توقيع العود', true, 2),
  ('Paiement à la livraison dans toutes les 58 wilayas', 'الدفع عند الاستلام في جميع الولايات الـ58', true, 3);
