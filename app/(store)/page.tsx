'use client'
import { useMemo, useEffect } from 'react'
import { HeroSection } from '@/components/store/HeroSection'
import { BrandsMarquee } from '@/components/store/BrandsMarquee'
import { TagSection } from '@/components/store/TagSection'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { HowItWorks } from '@/components/store/HowItWorks'
import { useProductsStore } from '@/store/products.store'
import { useTagsStore } from '@/store/tags.store'
import { useBrandsStore } from '@/store/brands.store'
import { useCategoriesStore } from '@/store/categories.store'
import { useSettingsStore } from '@/store/settings.store'

export default function HomePage() {
  const fetchProducts = useProductsStore(s => s.fetchProducts)
  const fetchTags = useTagsStore(s => s.fetchTags)
  const fetchBrands = useBrandsStore(s => s.fetchBrands)
  const fetchCategories = useCategoriesStore(s => s.fetchCategories)
  const fetchSettings = useSettingsStore(s => s.fetchSettings)

  useEffect(() => {
    fetchProducts()
    fetchTags()
    fetchBrands()
    fetchCategories()
    fetchSettings()
  }, [fetchProducts, fetchTags, fetchBrands, fetchCategories, fetchSettings])

  // Select raw arrays (stable references from Zustand)
  const brands = useBrandsStore(s => s.brands)
  const tags = useTagsStore(s => s.tags)
  const products = useProductsStore(s => s.products)
  const categories = useCategoriesStore(s => s.categories)

  // Derive filtered/sorted data with useMemo (avoids infinite re-render loop)
  const homepageTags = useMemo(
    () => tags.filter(t => t.show_on_homepage).sort((a, b) => (a.homepage_order || 0) - (b.homepage_order || 0)),
    [tags]
  )

  return (
    <main>
      {/* 1. Hero with Stats */}
      <HeroSection />

      {/* 2. Marques défilantes (Dynamique) */}
      <BrandsMarquee brands={brands} />

      {/* 3. Sections par tag (Arrivage, Best-seller, Premium) */}
      {homepageTags.map(tag => {
        const tagProducts = products.filter(
          p => p.status === 'active' && p.tag_ids?.includes(tag.id)
        )
        if (tagProducts.length === 0) return null
        return (
          <TagSection
            key={tag.id}
            tag={tag}
            products={tagProducts}
          />
        )
      })}

      {/* 4. Grille catégories (Dynamique) */}
      <CategoriesGrid categories={categories} />

      {/* 5. Comment commander (Version premium) */}
      <HowItWorks />
    </main>
  )
}
