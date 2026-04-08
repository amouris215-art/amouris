"use client";

import { useEffect } from 'react';
import { useProductsStore } from '@/store/products.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useBrandsStore } from '@/store/brands.store';
import { useCollectionsStore } from '@/store/collections.store';
import { useTagsStore } from '@/store/tags.store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_COLLECTIONS, 
  INITIAL_TAGS 
} from '@/lib/initial-data';

export function StoreInitializer() {
  const { products, seed: seedProducts } = useProductsStore();
  const { categories, seed: seedCategories } = useCategoriesStore();
  const { brands, seed: seedBrands } = useBrandsStore();
  const { collections, seed: seedCollections } = useCollectionsStore();
  const { tags, seed: seedTags } = useTagsStore();

  useEffect(() => {
    // Seed stores if they are empty
    if (products.length === 0) seedProducts(INITIAL_PRODUCTS);
    if (categories.length === 0) seedCategories(INITIAL_CATEGORIES);
    if (brands.length === 0) seedBrands(INITIAL_BRANDS);
    if (collections.length === 0) seedCollections(INITIAL_COLLECTIONS);
    if (tags.length === 0) seedTags(INITIAL_TAGS);
  }, []);

  return null;
}
