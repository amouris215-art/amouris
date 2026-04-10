import { fetchCategories } from '@/lib/api/categories';
import { fetchAllProducts } from '@/lib/api/products';
import CategoriesClient from './CategoriesClient';

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchAllProducts({ status: 'admin' })
  ]);

  // Enrich categories with product counts
  const categoriesWithCounts = categories.map((cat: any) => ({
    ...cat,
    product_count: products.filter((p: any) => p.category_id === cat.id).length
  }));

  return <CategoriesClient initialCategories={categoriesWithCounts} />;
}
