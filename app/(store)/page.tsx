import { HeroSection } from '@/components/store/HeroSection'
import { BrandsMarquee } from '@/components/store/BrandsMarquee'
import { TagSection } from '@/components/store/TagSection'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { HowItWorks } from '@/components/store/HowItWorks'
import { mockProducts, mockTags, mockBrands, mockCategories } from '@/lib/mock-data'

export default function HomePage() {
  const homepageTags = mockTags
    .filter(t => t.show_on_homepage)
    .sort((a, b) => a.homepage_order - b.homepage_order)

  return (
    <main>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Marques défilantes */}
      <BrandsMarquee brands={mockBrands} />

      {/* 3. Sections par tag (Arrivage, Best-seller, Premium) */}
      {homepageTags.map(tag => {
        const tagProducts = mockProducts.filter(
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

      {/* 4. Grille catégories */}
      <CategoriesGrid categories={mockCategories} />

      {/* 5. Comment commander */}
      <HowItWorks />
    </main>
  )
}
