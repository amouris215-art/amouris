import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, name_fr, name_ar, slug, product_type,
      description_fr, description_ar,
      price_per_gram, base_price, images, stock_grams,
      categories ( id, name_fr, name_ar, slug ),
      brands ( id, name, name_ar ),
      collections ( id, name_fr, name_ar ),
      flacon_variants ( id, size_ml, color, color_name, shape, price, stock_units ),
      product_tags ( tags ( id, name_fr, name_ar, slug ) )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    console.error('Product fetch error:', error)
  }

  if (!product) {
    notFound()
  }

  // Passer au composant client SANS les valeurs de stock exactes
  const productForClient = {
    ...product,
    in_stock: product.product_type === 'perfume'
      ? ((product as any).stock_grams ?? 0) > 0
      : true,
    // Pour les flacons, exposer un tableau variants avec is_available pour le frontend
    variants: product.flacon_variants?.map((v: any) => ({
      ...v,
      is_available: v.stock_units > 0,
    })),
    flacon_variants: product.flacon_variants?.map((v: any) => ({
      ...v,
      in_stock: v.stock_units > 0,
      stock_units: undefined, // Ne pas exposer la quantité exacte
    }))
  }

  return <ProductClient initialProduct={productForClient as any} initialTags={[]} />
}
