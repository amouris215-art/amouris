'use client'
import { useState, useEffect, useMemo } from 'react'
import { HeroSection } from '@/components/store/HeroSection'
import { BrandsMarquee } from '@/components/store/BrandsMarquee'
import { TagSection } from '@/components/store/TagSection'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { HowItWorks } from '@/components/store/HowItWorks'
import { getProducts } from '@/lib/actions/products'
import { getHomepageTags } from '@/lib/actions/tags'
import { getBrands } from '@/lib/actions/brands'
import { getCategories } from '@/lib/actions/categories'
import { Product, Tag, Brand, Category } from '@/lib/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [p, t, b, c] = await Promise.all([
          getProducts({ status: 'active' }),
          getHomepageTags(),
          getBrands(),
          getCategories()
        ])
        setProducts(p)
        setTags(t)
        setBrands(b)
        setCategories(c)
      } catch (error) {
        console.error('Failed to load homepage data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-900"></div>
      </div>
    )
  }

  return (
    <main>
      {/* 1. Hero with Stats */}
      <HeroSection />

      {/* 2. Marques défilantes (Dynamique) */}
      <BrandsMarquee brands={brands} />

      {/* 3. Sections par tag (Arrivage, Best-seller, Premium) - Dynamique depuis Supabase */}
      {tags.map(tag => {
        const tagProducts = products.filter(
          p => p.status === 'active' && p.tagIds?.includes(tag.id)
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
