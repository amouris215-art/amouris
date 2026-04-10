import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import ParfumsClient from './ParfumsClient';

export default async function ParfumsPage() {
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
      .select('*, categories(*), brands(*), flacon_variants(*), product_tags(tag_id)')
      .eq('product_type', 'perfume')
      .eq('status', 'active'),
    supabase.from('categories').select('*'),
    supabase.from('brands').select('*'),
    supabase.from('tags').select('*')
  ]);

  return (
    <ParfumsClient 
      initialProducts={products || []} 
      initialCategories={categories || []}
      initialBrands={brands || []}
      initialTags={tags || []}
    />
  );
}
