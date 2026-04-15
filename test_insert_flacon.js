const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
  const { data: cat } = await supabase.from('categories').select('id').limit(1);
  const catId = cat?.[0]?.id || null;

  const { data, error } = await supabase.from('products').insert({
    product_type: 'flacon',
    name_fr: 'Test Flacon',
    name_ar: 'اختبار',
    slug: 'test-flacon-1',
    category_id: catId,
    status: 'active',
  }).select().single();
  
  if (error) console.error(error);
  else console.log('Inserted:', data);

  if (data) {
    const { error: error2 } = await supabase.from('flacon_variants').insert({
      product_id: data.id,
      size_ml: 50,
      color: '#FFFFFF',
      color_name: 'Blanc',
      shape: 'Carré',
      price: 500,
      stock_units: 10,
    });
    if (error2) console.error('variant err:', error2);
    else console.log('Variant inserted.');
  }
}
testInsert();
