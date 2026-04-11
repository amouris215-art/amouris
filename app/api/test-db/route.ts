import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    const [
      { count: productsCount, error: productsError },
      { count: categoriesCount, error: categoriesError },
      { count: brandsCount, error: brandsError },
      { data: productsData, error: productsDataError },
      { data: categoriesData, error: categoriesDataError }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('brands').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('id, name_fr, status').limit(3),
      supabase.from('categories').select('id, name_fr').limit(3)
    ])

    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.substring(0, 10) + '...',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + '...',
    }

    return NextResponse.json({
      status: 'success',
      counts: {
        products: productsCount,
        categories: categoriesCount,
        brands: brandsCount
      },
      sampleData: {
        products: productsData,
        categories: categoriesData
      },
      errors: {
        productsCount: productsError,
        categoriesCount: categoriesError,
        brandsCount: brandsError,
        productsData: productsDataError,
        categoriesData: categoriesDataError
      },
      env: envVars
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    )
  }
}
