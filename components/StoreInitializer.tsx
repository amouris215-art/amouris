"use client";

import { useEffect } from 'react';
import { useProductsStore } from '@/store/products.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useBrandsStore } from '@/store/brands.store';
import { useCollectionsStore } from '@/store/collections.store';
import { useTagsStore } from '@/store/tags.store';
import { useSettingsStore } from '@/store/settings.store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_COLLECTIONS, 
  INITIAL_TAGS 
} from '@/lib/initial-data';

export function StoreInitializer() {
  const { categories, seed: seedCategories, fetchCategories } = useCategoriesStore();
  const { brands, seed: seedBrands, fetchBrands } = useBrandsStore();
  const { collections, seed: seedCollections, fetchCollections } = useCollectionsStore();
  const { tags, seed: seedTags, fetchTags } = useTagsStore();
  const { fetchSettings } = useSettingsStore();
  const { fetchProducts, seed: seedProducts } = useProductsStore();

  useEffect(() => {
    // Initial data synchronization from Supabase
    fetchSettings();
    fetchCategories();
    fetchBrands();
    fetchCollections();
    fetchTags();
    fetchProducts();

    // Fallback: Seed stores if they are empty
    seedProducts(INITIAL_PRODUCTS);
    seedCategories(INITIAL_CATEGORIES);
    seedBrands(INITIAL_BRANDS);
    seedCollections(INITIAL_COLLECTIONS);
    seedTags(INITIAL_TAGS);
  }, []);

  return null;
}
