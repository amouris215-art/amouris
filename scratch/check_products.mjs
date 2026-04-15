
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, name_fr, product_type, status,
      flacon_variants ( id )
    `)
    .eq('product_type', 'flacon')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${products.length} flacons:`)
  products.forEach(p => {
    console.log(`- ${p.name_fr} (${p.status}): ${p.flacon_variants.length} variants`)
  })
}

checkProducts()
