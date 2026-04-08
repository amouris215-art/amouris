// /components/StoreInitializer.tsx
'use client'
import { useEffect } from 'react'
import { useProductsStore } from '@/store/products.store'
import { useCategoriesStore } from '@/store/categories.store'
import { useBrandsStore } from '@/store/brands.store'
import { useCollectionsStore } from '@/store/collections.store'
import { useTagsStore } from '@/store/tags.store'
import { useAnnouncementsStore } from '@/store/announcements.store'
import {
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS,
  INITIAL_COLLECTIONS, INITIAL_TAGS, INITIAL_ANNOUNCEMENTS
} from '@/lib/initial-data'

export function StoreInitializer() {
  const seedProducts = useProductsStore(s => s.seed)
  const seedCategories = useCategoriesStore(s => s.seed)
  const seedBrands = useBrandsStore(s => s.seed)
  const seedCollections = useCollectionsStore(s => s.seed)
  const seedTags = useTagsStore(s => s.seed)
  const seedAnnouncements = useAnnouncementsStore(s => s.seed)

  useEffect(() => {
    seedProducts(INITIAL_PRODUCTS)
    seedCategories(INITIAL_CATEGORIES)
    seedBrands(INITIAL_BRANDS)
    seedCollections(INITIAL_COLLECTIONS)
    seedTags(INITIAL_TAGS)
    seedAnnouncements(INITIAL_ANNOUNCEMENTS)
  }, [seedProducts, seedCategories, seedBrands, seedCollections, seedTags, seedAnnouncements])

  return null
}
