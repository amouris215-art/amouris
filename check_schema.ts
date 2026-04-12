import { createAdminClient } from './lib/supabase/admin';

async function checkSchema() {
  const admin = createAdminClient();
  
  console.log('--- Checking categories table ---');
  const { data: catData, error: catError } = await admin.from('categories').select('*').limit(1);
  if (catError) console.error('Error fetching categories:', catError);
  else console.log('Categories columns:', Object.keys(catData[0] || {}));

  console.log('\n--- Checking brands table ---');
  const { data: brandData, error: brandError } = await admin.from('brands').select('*').limit(1);
  if (brandError) console.error('Error fetching brands:', brandError);
  else console.log('Brands columns:', Object.keys(brandData[0] || {}));

  console.log('\n--- Checking collections table ---');
  const { data: collData, error: collError } = await admin.from('collections').select('*').limit(1);
  if (collError) console.error('Error fetching collections:', collError);
  else console.log('Collections columns:', Object.keys(collData[0] || {}));
}

checkSchema();
