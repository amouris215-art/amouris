import { createClient } from '@/lib/supabase/server'
import FlaconsClient from './FlaconsClient'

export const dynamic = 'force-dynamic'

export default async function FlaconsPage() {
  const supabase = await createClient()

  const { data: flacons, error } = await supabase
    .from('products')
    .select(`
      id, name_fr, name_ar, slug, product_type,
      base_price, images,
      categories ( id, name_fr, name_ar ),
      flacon_variants ( id, size_ml, color, color_name, shape, price, stock_units )
    `)
    .eq('product_type', 'flacon')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading flacons:', error)
  }

  return (
    <FlaconsClient 
      initialProducts={flacons as any ?? []} 
      initialCategories={[]}
      initialBrands={[]}
      initialTags={[]}
    />
  )
}
