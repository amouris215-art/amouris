import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('Verifying aliased query for flacons...');
  const { data, error } = await supabase
    .from('products')
    .select('id, name_fr, variants:flacon_variants(*)')
    .eq('product_type', 'flacon')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('Product data:', JSON.stringify(data, null, 2));
  
  if (data && data[0] && data[0].variants) {
    console.log('SUCCESS: "variants" field is populated via alias.');
  } else {
    console.log('FAILURE: "variants" field is missing.');
  }
}

verify();
