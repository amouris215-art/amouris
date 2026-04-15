-- Seed script for flacons with correct color_name and variants
-- This script uses the data from amouris_seed.sql but fixes the color_name issue

-- Delete existing test flacons or those that might conflict
DELETE FROM products WHERE product_type = 'flacon';

-- FLACONS (10)
INSERT INTO products (id, product_type, name_fr, name_ar, slug, description_fr, description_ar, category_id, base_price, status) VALUES
  ('528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 'flacon', 'Flacon Classique Transparent',  'قارورة كلاسيكية شفافة',   'flacon-classique-transparent',
   'Flacon en verre épais, bouchon doré. Design intemporel et élégant.',
   'قارورة زجاج سميك، سدادة ذهبية. تصميم خالد وأنيق.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 350, 'active'),

  ('0c593505-da7d-460c-9502-8dce7d07d866', 'flacon', 'Flacon Luxe Noir Atomiseur',    'قارورة فخمة سوداء بخاخ',  'flacon-luxe-noir-atomiseur',
   'Verre teinté noir mat avec atomiseur doré. L''élégance absolue.',
   'زجاج ملون بالأسود المات مع بخاخ ذهبي. الأناقة المطلقة.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 550, 'active'),

  ('1d250bf2-20ee-4739-9c33-e6277febc21e', 'flacon', 'Flacon Oriental Gravé',         'قارورة شرقية منقوشة',     'flacon-oriental-grave',
   'Verre épais avec motifs orientaux gravés. Bouchon métal doré ciselé.',
   'زجاج سميك بنقوش شرقية. سدادة معدنية ذهبية منحوتة.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 890, 'active'),

  ('7c680a84-bc6d-4c68-8d01-597bdc793c0a', 'flacon', 'Mini Flacon Voyage',            'قارورة ميني للسفر',       'mini-flacon-voyage',
   'Format de voyage pratique, parfait pour les petites commandes ou les cadeaux.',
   'حجم سفر عملي، مثالي للطلبات الصغيرة أو الهدايا.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 180, 'active'),

  ('e72812cb-9c7d-4a19-9767-5700feb13028', 'flacon', 'Flacon Carré Élégant',          'قارورة مربعة أنيقة',      'flacon-carre-elegant',
   'Design géométrique épuré. Disponible en plusieurs coloris tendance.',
   'تصميم هندسي راقٍ. متوفر بعدة ألوان عصرية.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 420, 'active'),

  ('d0b4f92c-cf2f-406c-adaa-292b39aac60b', 'flacon', 'Flacon Goutte Arabesque',       'قارورة قطرة عربسك',       'flacon-goutte-arabesque',
   'Forme goutte avec motifs arabesques, inspiration orientale pure.',
   'شكل قطرة بنقوش أرابيسك، إلهام شرقي أصيل.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 720, 'active'),

  ('47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 'flacon', 'Flacon Roll-on Pratique',       'قارورة رول أون عملية',    'flacon-roll-on',
   'Roll-on en verre pour application directe. Idéal pour les huiles de parfum.',
   'رول أون زجاجي للتطبيق المباشر. مثالي لزيوت العطور.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 150, 'active'),

  ('b6d77182-021d-49dd-9dde-e81bc0b31573', 'flacon', 'Flacon Prestige Grande Capacité','قارورة بريستيج كبيرة',   'flacon-prestige-grande-capacite',
   'Pour les professionnels exigeants. Verre épais, bouchon métal luxueux.',
   'للمحترفين المتطلبين. زجاج سميك، سدادة معدنية فاخرة.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 1100, 'active'),

  ('3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 'flacon', 'Flacon Bohème Coloré',          'قارورة بوهيم ملونة',      'flacon-boheme-colore',
   'Verre coloré artisanal, chaque pièce est unique. Style bohème chic.',
   'زجاج ملون حرفي، كل قطعة فريدة. أسلوب بوهيمي راقٍ.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 480, 'active'),

  ('9223c6af-88d5-4d77-abd3-e94cea7ceba5', 'flacon', 'Flacon Hexagonal Premium',      'قارورة سداسية بريميوم',   'flacon-hexagonal-premium',
   'Forme hexagonale géométrique, verre épais taillé. Classe absolue.',
   'شكل سداسي هندسي، زجاج سميك مصقول. أناقة فائقة.', 'd90ad129-fd60-4d1f-87c4-82a8b0f854ca', 680, 'active');

-- VARIANTES DES FLACONS
INSERT INTO flacon_variants (id, product_id, size_ml, color, color_name, shape, price, stock_units) VALUES
  -- flc-01 Classique Transparent
  ('00a28d2d-d7c4-40a5-a5c5-d5a4119a5f00', '528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 30,  '#F8F8FF', 'Transparent',     'Carré',            350,  200),
  ('2a85e230-698a-4175-bbff-53381bed90da', '528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 50,  '#F8F8FF', 'Transparent',     'Carré',            450,  150),
  ('47c5d636-013e-4e9b-aede-3a12a761157f', '528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 100, '#F8F8FF', 'Transparent',     'Carré',            600,  100),

  -- flc-02 Noir Atomiseur
  ('b93ce0ab-d072-4e75-b35d-fdb8c8591862', '0c593505-da7d-460c-9502-8dce7d07d866', 30,  '#1A1A1A', 'Noir',            'Rond',             550,   80),
  ('79e000ac-26fb-47fa-a2f3-01540711d277', '0c593505-da7d-460c-9502-8dce7d07d866', 50,  '#1A1A1A', 'Noir',            'Rond',             750,   60),
  ('75556302-a27c-4c83-bcfa-6c4034d704ed', '0c593505-da7d-460c-9502-8dce7d07d866', 100, '#1A1A1A', 'Noir',            'Rond',             950,   40),
  ('8a1d3553-bd1a-4481-b868-df3152044a42', '0c593505-da7d-460c-9502-8dce7d07d866', 50,  '#1B2A4A', 'Bleu Nuit',       'Rond',             780,   35),

  -- flc-03 Oriental Gravé
  ('2dbededd-df6d-4fd4-9097-69fc15b9b292', '1d250bf2-20ee-4739-9c33-e6277febc21e', 50,  '#C9A84C', 'Or',              'Octogonal',        890,   50),
  ('41977bb0-40d9-423b-84e3-941db118d3ff', '1d250bf2-20ee-4739-9c33-e6277febc21e', 100, '#C9A84C', 'Or',              'Octogonal',       1200,   30),
  ('cd025887-0c32-4794-b013-e047a2814f67', '1d250bf2-20ee-4739-9c33-e6277febc21e', 50,  '#1B4332', 'Vert Impérial',   'Octogonal',        920,   45),
  ('03778d49-91ef-437d-8480-aa4e9e10ab43', '1d250bf2-20ee-4739-9c33-e6277febc21e', 100, '#1B4332', 'Vert Impérial',   'Octogonal',       1250,   25),

  -- flc-04 Mini Voyage
  ('6357ba7a-d1ae-4556-82b7-9df734c636aa', '7c680a84-bc6d-4c68-8d01-597bdc793c0a', 5,   '#F8F8FF', 'Transparent',     'Cylindrique',      180,  500),
  ('8e0b5a51-674e-4d0d-9bf9-95ed91abecfd', '7c680a84-bc6d-4c68-8d01-597bdc793c0a', 10,  '#F8F8FF', 'Transparent',     'Cylindrique',      220,  400),
  ('8a2e5c3a-c0df-4213-8d2b-90bf970a8179', '7c680a84-bc6d-4c68-8d01-597bdc793c0a', 5,   '#E8D5B7', 'Ambre Lumière',   'Cylindrique',      200,  300),

  -- flc-05 Carré Élégant
  ('65e1f6e2-4fac-44e3-8939-071fe057fad8', 'e72812cb-9c7d-4a19-9767-5700feb13028', 30,  '#FFFFFF', 'Blanc Pur',       'Carré',            420,  120),
  ('86ee960f-637d-4433-b8a9-4c53e6be6357', 'e72812cb-9c7d-4a19-9767-5700feb13028', 50,  '#FFFFFF', 'Blanc Pur',       'Carré',            520,  100),
  ('4e0a6d53-c72e-4526-8e96-e99a6ceff283', 'e72812cb-9c7d-4a19-9767-5700feb13028', 30,  '#8B4513', 'Ambre Sombre',    'Carré',            440,   80),
  ('d88a06f6-b702-4e24-b215-a8f30e531830', 'e72812cb-9c7d-4a19-9767-5700feb13028', 50,  '#8B4513', 'Ambre Sombre',    'Carré',            540,   60),
  ('0ef91d67-64f7-49c9-9e02-c307d0d46e20', 'e72812cb-9c7d-4a19-9767-5700feb13028', 30,  '#2C3E50', 'Bleu Profond',    'Carré',            450,   70),

  -- flc-06 Goutte Arabesque
  ('1e860f20-dca2-4ae4-9823-6c92f8bafec0', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 50,  '#C9A84C', 'Or',              'Goutte',           720,   45),
  ('c9fee4eb-b5dc-49d7-8619-cbd2f244a38e', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 100, '#C9A84C', 'Or',              'Goutte',           980,   30),
  ('9889ce30-a8ad-4b7e-8b01-58c7916a1d7e', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 50,  '#B22222', 'Rouge Rubis',     'Goutte',           750,   40),
  ('c343b593-a15a-4311-a16b-15734e65e332', 'd0b4f92c-cf2f-406c-adaa-292b39aac60b', 50,  '#1B4332', 'Vert Émeraude',    'Goutte',           750,   35),

  -- flc-07 Roll-on
  ('6436e8f5-fbe2-49aa-95b9-86d0af84e118', '47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 6,   '#F8F8FF', 'Transparent',     'Roll-on',          150,  600),
  ('0554b3a0-c168-4cf0-9078-19f2170b4503', '47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 10,  '#F8F8FF', 'Transparent',     'Roll-on',          190,  500),
  ('a43bf644-940b-496a-894a-b574d7238b0c', '47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 6,   '#1A1A1A', 'Noir',            'Roll-on',          165,  400),

  -- flc-08 Prestige Grande Capacité
  ('1bf828d3-9939-4224-9f14-afcbf8bd5e2a', 'b6d77182-021d-49dd-9dde-e81bc0b31573', 100, '#F8F8FF', 'Cristal',         'Carré Biseauté',  1100,   25),
  ('9af0456d-4b5b-4f96-a333-8fbf4f80168f', 'b6d77182-021d-49dd-9dde-e81bc0b31573', 200, '#F8F8FF', 'Cristal',         'Carré Biseauté',  1800,   15),
  ('79a33699-eede-42b8-92e6-c26880bda88e', 'b6d77182-021d-49dd-9dde-e81bc0b31573', 100, '#1A1A1A', 'Noir Profond',    'Carré Biseauté',  1150,   20),

  -- flc-09 Bohème Coloré
  ('c940eb10-f2cc-4ef0-a993-1fcd699dc14c', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 30,  '#8B0000', 'Bordeaux',        'Irrégulier',       480,   60),
  ('35855ee3-2db3-4715-b4f3-7498532c7b39', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 30,  '#00695C', 'Sarcelle',        'Irrégulier',       490,   55),
  ('0ffb46d2-d78a-43bd-8484-48f88e83fbdd', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 30,  '#4A0080', 'Violet',          'Irrégulier',       490,   50),
  ('e57a2058-22e5-4c95-be9e-2a99f96cc86a', '3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 50,  '#C9A84C', 'Or',              'Irrégulier',       620,   40),

  -- flc-10 Hexagonal
  ('c8aaca09-678b-4a8f-b83d-cd86a6d647f9', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 50,  '#F8F8FF', 'Transparent',     'Hexagonal',        680,   70),
  ('3f1530d3-a520-4391-a315-b4973f946e6b', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 100, '#F8F8FF', 'Transparent',     'Hexagonal',        950,   50),
  ('65a4c7ed-7e23-412d-8477-441863a5afe8', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 50,  '#1A1A1A', 'Noir',            'Hexagonal',        710,   40),
  ('a631c72b-354b-4dce-aa47-0be7ba163d27', '9223c6af-88d5-4d77-abd3-e94cea7ceba5', 100, '#1A1A1A', 'Noir',            'Hexagonal',        980,   30);

-- TAGS DES FLACONS
INSERT INTO product_tags (product_id, tag_id) VALUES
  ('528f03d5-f001-4f4d-8ca7-b4e94cd8bc22', 'tag-01'),
  ('0c593505-da7d-460c-9502-8dce7d07d866', 'tag-02'), ('0c593505-da7d-460c-9502-8dce7d07d866', 'tag-03'),
  ('1d250bf2-20ee-4739-9c33-e6277febc21e', 'tag-03'),
  ('7c680a84-bc6d-4c68-8d01-597bdc793c0a', 'tag-01'), ('7c680a84-bc6d-4c68-8d01-597bdc793c0a', 'tag-02'),
  ('e72812cb-9c7d-4a19-9767-5700feb13028', 'tag-02'),
  ('d0b4f92c-cf2f-406c-adaa-292b39aac60b', 'tag-01'), ('d0b4f92c-cf2f-406c-adaa-292b39aac60b', 'tag-03'),
  ('47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 'tag-01'), ('47acff8b-28ac-4ae3-8a0b-3cbfe8fa3c08', 'tag-02'),
  ('b6d77182-021d-49dd-9dde-e81bc0b31573', 'tag-03'),
  ('3a7d623c-d2ad-4602-b2c2-a80b9dd7acb1', 'tag-01'),
  ('9223c6af-88d5-4d77-abd3-e94cea7ceba5', 'tag-02'), ('9223c6af-88d5-4d77-abd3-e94cea7ceba5', 'tag-03');
