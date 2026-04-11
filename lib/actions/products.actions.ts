'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createProductAction(formData: {
  product_type: string
  name_fr: string
  name_ar: string
  description_fr: string
  description_ar: string
  category_id: string
  brand_id: string | null
  collection_id: string | null
  tag_ids: string[]
  price_per_gram?: number
  stock_grams?: number
  base_price?: number
  variants?: Array<{
    size_ml: number
    color: string
    color_name: string
    shape: string
    price: number
    stock_units: number
  }>
  status: string
}) {
  const supabase = createAdminClient()

  // Générer le slug depuis le nom FR
  const slug = formData.name_fr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim() + '-' + Date.now()

  // Insérer le produit
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      product_type: formData.product_type,
      name_fr: formData.name_fr,
      name_ar: formData.name_ar,
      slug,
      description_fr: formData.description_fr,
      description_ar: formData.description_ar,
      category_id: formData.category_id || null,
      brand_id: formData.brand_id || null,
      collection_id: formData.collection_id || null,
      price_per_gram: formData.price_per_gram ?? null,
      stock_grams: formData.stock_grams ?? null,
      base_price: formData.base_price ?? null,
      status: formData.status,
    })
    .select()
    .single()

  if (productError) throw new Error(productError.message)

  // Insérer les tags
  if (formData.tag_ids.length > 0) {
    await supabase.from('product_tags').insert(
      formData.tag_ids.map(tagId => ({
        product_id: product.id,
        tag_id: tagId,
      }))
    )
  }

  // Insérer les variantes (flacons et accessoires)
  if (formData.variants && formData.variants.length > 0) {
    await supabase.from('flacon_variants').insert(
      formData.variants.map(v => ({
        ...v,
        product_id: product.id,
      }))
    )
  }

  revalidatePath('/shop')
  revalidatePath('/shop/parfums')
  revalidatePath('/shop/flacons')
  revalidatePath('/shop/accessoires')
  revalidatePath('/')
  revalidatePath('/admin/products')

  return { success: true, product }
}

export async function updateProductAction(id: string, formData: any) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .update({
      name_fr: formData.name_fr,
      name_ar: formData.name_ar,
      description_fr: formData.description_fr,
      description_ar: formData.description_ar,
      category_id: formData.category_id || null,
      brand_id: formData.brand_id || null,
      collection_id: formData.collection_id || null,
      price_per_gram: formData.price_per_gram ?? null,
      stock_grams: formData.stock_grams ?? null,
      base_price: formData.base_price ?? null,
      status: formData.status,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  // Synchroniser tags
  await supabase.from('product_tags').delete().eq('product_id', id)
  if (formData.tag_ids?.length > 0) {
    await supabase.from('product_tags').insert(
      formData.tag_ids.map((tagId: string) => ({ product_id: id, tag_id: tagId }))
    )
  }

  // Synchroniser variantes
  await supabase.from('flacon_variants').delete().eq('product_id', id)
  if (formData.variants?.length > 0) {
    await supabase.from('flacon_variants').insert(
      formData.variants.map((v: any) => ({ ...v, product_id: id }))
    )
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/shop')

  return { success: true }
}

export async function deleteProductAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/shop')

  return { success: true }
}
