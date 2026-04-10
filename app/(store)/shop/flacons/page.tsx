import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import FlaconsClient from './FlaconsClient';

export default async function FlaconsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [
    { data: products },
    { data: categories },
    { data: brands },
    { data: tags }
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(*), brands(*), variants:flacon_variants(*), product_tags(tag_id)')
      .eq('product_type', 'flacon')
      .eq('status', 'active'),
    supabase.from('categories').select('*'),
    supabase.from('brands').select('*'),
    supabase.from('tags').select('*')
  ]);

  return (
    <FlaconsClient 
      initialProducts={products || []} 
      initialCategories={categories || []}
      initialBrands={brands || []}
      initialTags={tags || []}
    />
  );
}
