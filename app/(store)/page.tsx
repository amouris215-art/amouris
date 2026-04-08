'use client'
import { useMemo } from 'react'
import { HeroSection } from '@/components/store/HeroSection'
import { BrandsMarquee } from '@/components/store/BrandsMarquee'
import { TagSection } from '@/components/store/TagSection'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { HowItWorks } from '@/components/store/HowItWorks'
import { useProductsStore } from '@/store/products.store'
import { useTagsStore } from '@/store/tags.store'
import { useBrandsStore } from '@/store/brands.store'
import { useCategoriesStore } from '@/store/categories.store'

export default function HomePage() {
  const products = useProductsStore(s => s.products)
  const tags = useTagsStore(s => s.tags)
  const homepageTags = useMemo(() => tags.filter(t => t.show_on_homepage).sort((a, b) => a.homepage_order - b.homepage_order), [tags])
  const brands = useBrandsStore(s => s.brands)
  const categories = useCategoriesStore(s => s.categories)

  return (
    <main>
      {/* 1. Hero with Stats */}
      <HeroSection />

      {/* 2. Marques défilantes (Dynamique) */}
      <BrandsMarquee brands={brands} />

      {/* 3. Sections par tag (Arrivage, Best-seller, Premium) - Dynamique depuis le store */}
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

      {/* 5. Comment commander (Remplacé par la version premium) */}
      <HowItWorks />
    </main>
  )
}
