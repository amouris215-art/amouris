import { fetchAllProducts } from '@/lib/api/products';
import { fetchSettings } from '@/lib/api/settings';
import { fetchCategories } from '@/lib/api/categories';
import InventoryClient from './InventoryClient';

export default async function AdminInventoryPage() {
  const [products, settings, categories] = await Promise.all([
    fetchAllProducts({ status: 'admin' }),
    fetchSettings(),
    fetchCategories()
  ]);

  return (
    <InventoryClient 
      initialProducts={products} 
      settings={settings} 
      categories={categories} 
    />
  );
}
