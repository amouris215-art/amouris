import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { fetchAllProducts } from '@/lib/api/products';
import AdminProductsClient from './AdminProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [
    products,
    { data: categories },
    { data: brands },
    { data: collections },
    { data: tags }
  ] = await Promise.all([
    fetchAllProducts({ status: 'admin' }),
    supabase.from('categories').select('*'),
    supabase.from('brands').select('*'),
    supabase.from('collections').select('*'),
    supabase.from('tags').select('*')
  ]);

  return (
    <AdminProductsClient 
      initialProducts={products || []} 
      categories={categories || []}
      brands={brands || []}
      collections={collections || []}
      tags={tags || []}
    />
  );
}
