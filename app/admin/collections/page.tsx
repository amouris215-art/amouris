import { fetchCollections } from '@/lib/api/catalogue';
import { fetchAllProducts } from '@/lib/api/products';
import CollectionsClient from './CollectionsClient';

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([
    fetchCollections(),
    fetchAllProducts({ status: 'admin' })
  ]);

  // Enrich collections with product counts
  const collectionsWithCounts = collections.map((col: any) => ({
    ...col,
    product_count: products.filter((p: any) => p.collection_id === col.id).length
  }));

  return <CollectionsClient initialCollections={collectionsWithCounts} />;
}
