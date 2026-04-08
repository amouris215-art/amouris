export const mockCategories = [
  { id: 'cat-01', name_ar: 'عود', name_fr: 'Oud' },
  { id: 'cat-02', name_ar: 'زهري', name_fr: 'Floral' },
  { id: 'cat-03', name_ar: 'شرقي', name_fr: 'Oriental' },
  { id: 'cat-04', name_ar: 'منعش', name_fr: 'Frais' },
  { id: 'cat-05', name_ar: 'خشبي', name_fr: 'Boisé' },
  { id: 'cat-06', name_ar: 'مسكي', name_fr: 'Musqué' },
  { id: 'cat-07', name_ar: 'توابل', name_fr: 'Épicé' },
  { id: 'cat-08', name_ar: 'حمضيات', name_fr: 'Citrus' },
  { id: 'cat-09', name_ar: 'مائي', name_fr: 'Aquatique' },
  { id: 'cat-10', name_ar: 'عنبري', name_fr: 'Ambré' },
]

export const mockBrands = [
  { id: 'b1', name_ar: 'الحرمين', name_fr: 'Al Haramain' },
  { id: 'b2', name_ar: 'عمواج', name_fr: 'Amouage' },
  { id: 'b3', name_ar: 'لطافة', name_fr: 'Lattafa' },
  { id: 'b4', name_ar: 'ميزون طهارة', name_fr: 'Maison Tahara' },
  { id: 'b5', name_ar: 'رصاصي', name_fr: 'Rasasi' },
  { id: 'b6', name_ar: 'سويس أربيان', name_fr: 'Swiss Arabian' },
]

export const mockCollections = [
  { id: 'col1', name_ar: 'المجموعة الملكية', name_fr: 'Collection Royale' },
  { id: 'col2', name_ar: 'الصيف العربي', name_fr: 'Été Arabe' },
]

export const mockTags = [
  { id: 'tag-01', name_ar: 'وصل جديد', name_fr: 'Arrivage', show_on_homepage: true, homepage_order: 1, slug: 'arrivage' },
  { id: 'tag-02', name_ar: 'الأكثر مبيعاً', name_fr: 'Best-seller', show_on_homepage: true, homepage_order: 2, slug: 'best-seller' },
  { id: 'tag-03', name_ar: 'مميز', name_fr: 'Premium', show_on_homepage: true, homepage_order: 3, slug: 'premium' },
  { id: 'tag-04', name_ar: 'عرض خاص', name_fr: 'Offre spéciale', show_on_homepage: false, homepage_order: 4, slug: 'offre' },
]

export const mockProducts = [
  // PARFUMS
  {
    id: 'p1', product_type: 'perfume', slug: 'rose-du-taif',
    name_fr: 'Rose du Taif', name_ar: 'وردة الطائف',
    category_id: 'cat-02', brand_id: 'b1', tag_ids: ['tag-01', 'tag-02'],
    price_per_gram: 850, stock_grams: 5000,
    status: 'active',
  },
  {
    id: 'p2', product_type: 'perfume', slug: 'oud-malaki',
    name_fr: 'Oud Malaki', name_ar: 'عود ملكي',
    category_id: 'cat-01', brand_id: 'b2', tag_ids: ['tag-02', 'tag-03'],
    price_per_gram: 1200, stock_grams: 3000,
    status: 'active',
  },
  {
    id: 'p3', product_type: 'perfume', slug: 'jasmin-sauvage',
    name_fr: 'Jasmin Sauvage', name_ar: 'ياسمين بري',
    category_id: 'cat-02', brand_id: 'b4', tag_ids: ['tag-01'],
    price_per_gram: 650, stock_grams: 4500,
    status: 'active',
  },
  {
    id: 'p4', product_type: 'perfume', slug: 'ambre-noir',
    name_fr: 'Ambre Noir', name_ar: 'عنبر أسود',
    category_id: 'cat-03', brand_id: 'b5', tag_ids: ['tag-03'],
    price_per_gram: 950, stock_grams: 2500,
    status: 'active',
  },
  {
    id: 'p5', product_type: 'perfume', slug: 'musc-tahara',
    name_fr: 'Musc Tahara', name_ar: 'مسك طهارة',
    category_id: 'cat-04', brand_id: 'b4', tag_ids: ['tag-01', 'tag-02'],
    price_per_gram: 500, stock_grams: 6000,
    status: 'active',
  },

  // FLACONS
  {
    id: 'f1', product_type: 'flacon', slug: 'flacon-classique',
    name_fr: 'Flacon Classique Transparent', name_ar: 'قارورة كلاسيكية شفافة',
    category_id: 'cat-01', tag_ids: ['tag-01'],
    base_price: 350,
    status: 'active',
    variants: [
      { id: 'fv1', price: 350, color: 'transparent', size: '30ml' },
      { id: 'fv2', price: 450, color: 'transparent', size: '50ml' },
    ]
  },
  {
    id: 'f2', product_type: 'flacon', slug: 'flacon-luxe-noir',
    name_fr: 'Flacon Luxe Noir Atomiseur', name_ar: 'قارورة فخمة سوداء',
    category_id: 'cat-01', tag_ids: ['tag-02', 'tag-03'],
    base_price: 550,
    status: 'active',
    variants: [
      { id: 'fv4', price: 550, color: 'black', size: '30ml' },
      { id: 'fv5', price: 750, color: 'black', size: '50ml' },
    ]
  },
  {
    id: 'f3', product_type: 'flacon', slug: 'flacon-oriental',
    name_fr: 'Flacon Oriental Gravé', name_ar: 'قارورة شرقية',
    category_id: 'cat-01', tag_ids: ['tag-03'],
    base_price: 890,
    status: 'active',
    variants: [
      { id: 'fv8', price: 890, color: 'gold', size: '50ml' },
    ]
  },
  {
    id: 'f4', product_type: 'flacon', slug: 'mini-flacon-voyage',
    name_fr: 'Mini Flacon Voyage', name_ar: 'قارورة ميني للسفر',
    category_id: 'cat-01', tag_ids: ['tag-01', 'tag-02'],
    base_price: 180,
    status: 'active',
    variants: [
      { id: 'fv12', price: 180, color: 'transparent', size: '5ml' },
    ]
  },
]

export const mockCustomers = [
  { id: 'cu1', first_name: 'Mohammed', last_name: 'Benali', phone: '0550123456', wilaya: 'Alger' },
  { id: 'cu2', first_name: 'Fatima', last_name: 'Bouzidi', phone: '0661234567', wilaya: 'Oran' },
]

export const mockOrders = [
  {
    id: 'o1', order_number: 'AM-000001', customer_id: 'cu1',
    total_amount: 425000, order_status: 'delivered', payment_status: 'paid',
    created_at: '2026-03-15T12:00:00Z', guest_first_name: null, guest_last_name: null
  },
]
