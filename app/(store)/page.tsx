import { HeroSection } from '@/components/store/HeroSection'
import { BrandsMarquee } from '@/components/store/BrandsMarquee'
import { TagSection } from '@/components/store/TagSection'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { HowItWorks } from '@/components/store/HowItWorks'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Pipette } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/components/store/product-card'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()

  // 1. Charger tout en parallèle
  const [
    { data: homepageTags },
    { data: announcements },
    { data: brands },
    { data: categories }
  ] = await Promise.all([
    supabase.from('tags').select('*').eq('show_on_homepage', true).order('homepage_order'),
    supabase.from('announcements').select('*').eq('is_active', true).order('display_order'),
    supabase.from('brands').select('id, name, name_ar, logo_url'),
    supabase.from('categories').select('id, name_fr, name_ar, slug')
  ])

  // 2. Pour chaque tag homepage, charger ses produits
  const tagSections = await Promise.all(
    (homepageTags ?? []).map(async (tag) => {
      const { data: items } = await supabase
        .from('product_tags')
        .select(`
          products!inner(
            id, name_fr, name_ar, slug, product_type,
            price_per_gram, base_price, images, category_id,
            flacon_variants(id, price, color, color_name)
          )
        `)
        .eq('tag_id', tag.id)
        .eq('products.status', 'active')
        .limit(8)

      const products = items?.map(i => i.products).filter(Boolean) as any[] ?? []
      return { tag, products }
    })
  )

  // 3. Charger les accessoires mis en avant (Feature 7.5)
  const { data: featuredAccessoires } = await supabase
    .from('products')
    .select('id, name_fr, name_ar, slug, base_price, images, product_type, category_id')
    .eq('product_type', 'accessory')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <main className="min-h-screen">
      <HeroSection />

      <BrandsMarquee brands={brands as any || []} />

      {/* Sections par Tags */}
      {tagSections.map(({ tag, products }) => (
        products.length > 0 && (
          <TagSection
            key={tag.id}
            tag={tag as any}
            products={products}
          />
        )
      ))}

      {/* Section Accessoires (Feature 7.5) */}
      {featuredAccessoires && featuredAccessoires.length > 0 && (
        <section className="py-24 bg-neutral-50/50 overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-px bg-[#3d1a1a]" />
                  <Pipette className="w-4 h-4 text-[#3d1a1a]" />
                  <span className="text-[#3d1a1a] text-[10px] font-black uppercase tracking-[0.4em]">Expertise & Outils</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-gray-900">Accessoires & Outils Professionnels</h2>
              </div>
              <Link 
                href="/shop/accessoires"
                className="group flex items-center gap-3 text-gray-900 font-bold uppercase tracking-widest text-[10px] hover:text-[#3d1a1a] transition-colors"
              >
                Voir tout le matériel
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#3d1a1a] group-hover:text-white transition-all duration-500">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredAccessoires.map((acc, idx) => (
                <ProductCard key={acc.id} product={acc as any} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CategoriesGrid categories={categories as any || []} />

      <HowItWorks />
    </main>
  )
}
