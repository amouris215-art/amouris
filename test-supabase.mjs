import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing URL or KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log('Testing connection to Supabase...');
  try {
    const { data: products, error: pError } = await supabase.from('products').select('*').limit(3);
    console.log('Products:', products);
    if (pError) console.error('Products error:', pError);

    const { data: categories, error: cError } = await supabase.from('categories').select('*');
    console.log('Categories count:', categories?.length);
    if (cError) console.error('Categories error:', cError);
  } catch (error) {
    console.error('Exception:', error);
  }
}

test();
