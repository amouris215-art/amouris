'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createProductAction(formData: any) {
  try {
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
        images: formData.images || []
      })
      .select()
      .single()

    console.log('[PRODUCTS DEBUG] Created product with images:', formData.images);

    if (productError) {
      console.error('INSERT ERROR:', JSON.stringify(productError, null, 2))
      return { success: false, error: productError.message }
    }

    // Insérer les tags
    if (formData.tag_ids && formData.tag_ids.length > 0) {
      const { error: tagError } = await supabase.from('product_tags').insert(
        formData.tag_ids.map((tagId: string) => ({
          product_id: product.id,
          tag_id: tagId,
        }))
      )
      if (tagError) {
        console.error('TAG INSERT ERROR:', JSON.stringify(tagError, null, 2))
        return { success: false, error: 'Produit créé mais erreur lors de l\'ajout des tags: ' + tagError.message }
      }
    }

    // Insérer les variantes (flacons et accessoires)
    if (formData.variants && formData.variants.length > 0) {
      const variantsToInsert = formData.variants.map((v: any) => {
        const { id, isNew, ...variantData } = v;
        const payload: any = {
          ...variantData,
          product_id: product.id
        };
        // Only include id if it's a valid UUID
        if (id && !id.startsWith('new_') && !id.startsWith('v_')) {
          payload.id = id;
        }
        return payload;
      });
      const { error: variantError } = await supabase.from('flacon_variants').insert(variantsToInsert);
      if (variantError) {
        console.error('VARIANT INSERT ERROR:', JSON.stringify(variantError, null, 2))
        return { success: false, error: 'Produit créé mais erreur lors de l\'ajout des variantes: ' + variantError.message }
      }
    }

    revalidatePath('/shop')
    revalidatePath('/shop/parfums')
    revalidatePath('/shop/flacons')
    revalidatePath('/shop/accessoires')
    revalidatePath('/')
    revalidatePath('/admin/products')

    return { success: true, product }
  } catch (e: any) {
    console.error('ACTION ERROR:', e.message)
    return { success: false, error: e.message }
  }
}

export async function updateProductAction(id: string, formData: any) {
  try {
    const supabase = createAdminClient()

    const updatePayload: any = {
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
    }

    if (formData.images !== undefined) {
      updatePayload.images = formData.images
    }

    const { data: result, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    console.log('[PRODUCTS DEBUG] Updated product with images:', updatePayload.images);

    if (error) {
      console.error('UPDATE ERROR:', JSON.stringify(error, null, 2))
      return { success: false, error: error.message }
    }

    // Synchroniser tags
    if (formData.tag_ids !== undefined) {
      await supabase.from('product_tags').delete().eq('product_id', id)
      if (formData.tag_ids.length > 0) {
        const { error: tagError } = await supabase.from('product_tags').insert(
          formData.tag_ids.map((tagId: string) => ({ product_id: id, tag_id: tagId }))
        )
        if (tagError) return { success: false, error: 'Erreur lors de la mise à jour des tags' }
      }
    }

    // Synchroniser variantes
    if (formData.variants !== undefined) {
      // First get existing variant ids for this product to compare
      const { data: currentVariants } = await supabase.from('flacon_variants').select('id').eq('product_id', id)
      const existingIds = currentVariants?.map((v: any) => v.id) || [];
      const incomingIds = formData.variants.filter((v: any) => v.id && !v.id.startsWith('new_') && !v.id.startsWith('v_')).map((v: any) => v.id);

      // Deletions
      const toDelete = existingIds.filter(vId => !incomingIds.includes(vId));
      if (toDelete.length > 0) {
        const { error: delError } = await supabase.from('flacon_variants').delete().in('id', toDelete);
        if (delError) return { success: false, error: 'Erreur lors de la suppression d\'anciennes variantes' }
      }

      // Upsertions
      for (const v of formData.variants) {
        const { isNew, id: vId, product_id: pid, created_at, ...vData } = v;
        if (!v.id || v.id.startsWith('new_') || v.id.startsWith('v_')) {
          const { error: insError } = await supabase.from('flacon_variants').insert({
            ...vData,
            product_id: id
          });
          if (insError) return { success: false, error: 'Erreur lors de l\'ajout d\'une nouvelle variante' }
        } else {
          const { error: updError } = await supabase.from('flacon_variants').update(vData).eq('id', v.id);
          if (updError) return { success: false, error: 'Erreur lors de la modification d\'une variante' }
        }
      }
    }


    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/shop')
    revalidatePath('/shop/parfums')
    revalidatePath('/shop/flacons')
    revalidatePath('/shop/accessoires')

    return { success: true, data: result }
  } catch (e: any) {
    console.error('ACTION ERROR:', e.message)
    return { success: false, error: e.message }
  }
}

export async function deleteProductAction(id: string) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    
    if (error) {
      console.error('DELETE ERROR:', JSON.stringify(error, null, 2))
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/shop')
    revalidatePath('/shop/parfums')
    revalidatePath('/shop/flacons')
    revalidatePath('/shop/accessoires')

    return { success: true }
  } catch (e: any) {
    console.error('ACTION ERROR:', e.message)
    return { success: false, error: e.message }
  }
}
