import { HeroSection } from '@/components/store/HeroSection'
import { BrandsMarquee } from '@/components/store/BrandsMarquee'
import { TagSection } from '@/components/store/TagSection'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { HowItWorks } from '@/components/store/HowItWorks'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Charger en parallèle avec Promise.all
  const [
    { data: tags },
    { data: brands },
    { data: categories }
  ] = await Promise.all([
    supabase
      .from('tags')
      .select('*')
      .eq('show_on_homepage', true)
      .order('homepage_order', { ascending: true }),
    supabase.from('brands').select('*'),
    supabase.from('categories').select('*')
  ])

  // 2. Pour chaque tag homepage, charger les produits
  const sectionsData = await Promise.all(
    (tags || []).map(async (tag) => {
      const { data: joinData } = await supabase
        .from('product_tags')
        .select(`
          products!inner(
            *,
            categories(*),
            brands(*),
            flacon_variants(*)
          )
        `)
        .eq('tag_id', tag.id)
        .eq('products.status', 'active')
        .limit(8)

      return {
        tag,
        products: joinData?.map((d: any) => ({
          ...d.products,
          tag_ids: [tag.id] // Minimal tag_ids for UI consistency if needed
        })) || []
      }
    })
  )

  const hasContent = sectionsData.some(s => s.products.length > 0)

  return (
    <main className="min-h-screen">
      <HeroSection />

      <BrandsMarquee brands={brands as any || []} />

      {!hasContent ? (
        <div className="py-24 text-center bg-neutral-50 border-y border-neutral-100">
           <h3 className="font-serif text-2xl text-emerald-950 mb-2">Nos collections arrivent</h3>
           <p className="text-gray-500 max-w-md mx-auto">Nous préparons actuellement nos nouveaux arrivages. Revenez très bientôt.</p>
        </div>
      ) : (
        sectionsData.map(({ tag, products }) => {
          if (products.length === 0) return null
          return (
            <TagSection
              key={tag.id}
              tag={tag as any}
              products={products as any}
            />
          )
        })
      )}

      <CategoriesGrid categories={categories as any || []} />

      <HowItWorks />
    </main>
  )
}
