import { fetchBrands } from '@/lib/api/brands';
import { fetchAllProducts } from '@/lib/api/products';
import BrandsClient from './BrandsClient';

export default async function AdminBrandsPage() {
  const [brands, products] = await Promise.all([
    fetchBrands(),
    fetchAllProducts({ status: 'admin' })
  ]);

  // Enrich brands with product counts
  const brandsWithCounts = brands.map((brand: any) => ({
    ...brand,
    product_count: products.filter((p: any) => p.brand_id === brand.id).length
  }));

  return <BrandsClient initialBrands={brandsWithCounts} />;
}
