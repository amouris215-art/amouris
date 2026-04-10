import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      categories(id, name_fr, name_ar),
      brands(id, name, name_ar, logo_url),
      collections(id, name_fr, name_ar),
      flacon_variants(*),
      product_tags(tag_id)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!product) {
    notFound();
  }

  // Pre-process for UI compatibility if needed
  // In our schema product_tags returns { tag_id }, but UI might expect tags directly.
  // We'll also fetch all tags to match the filter logic in ProductClient
  const { data: allTags } = await supabase.from('tags').select('*');

  return (
    <ProductClient 
      initialProduct={product as any} 
      initialTags={allTags || []}
    />
  );
}
