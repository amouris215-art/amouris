import { createClient } from '@/lib/supabase/client';


export const fetchAllProducts = async (options?: { status?: string }) => {
  
  const supabase = createClient();
  
  let query = supabase.from('products').select(`
    *,
    category:categories(*),
    brand:brands(*),
    collection:collections(*),
    variants:flacon_variants(*),
    tags:product_tags(tag:tags(*))
  `).order('created_at', { ascending: false });

  if (options?.status && options.status !== 'admin') {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(p => ({
    ...p,
    tag_ids: p.tags?.map((t: any) => t.tag?.id).filter(Boolean) || []
  }));
};

export const fetchProductById = async (id: string) => {
  
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      collection:collections(*),
      variants:flacon_variants(*),
      tags:product_tags(tag:tags(*))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  return {
    ...data,
    tag_ids: data.tags?.map((t: any) => t.tag?.id).filter(Boolean) || []
  };
};

export const createProduct = async (productData: any) => {
  // Always use browser client if called from client
  const supabase = createClient();
  
  const { tag_ids, variants, ...baseProduct } = productData;

  const { data: newProduct, error } = await supabase
    .from('products')
    .insert([baseProduct])
    .select()
    .single();

  if (error) throw error;

  if (tag_ids && tag_ids.length > 0) {
    const tagsToInsert = tag_ids.map((tagId: string) => ({
      product_id: newProduct.id,
      tag_id: tagId,
    }));
    await supabase.from('product_tags').insert(tagsToInsert);
  }

  return fetchProductById(newProduct.id);
};

export const updateProduct = async (id: string, updates: any) => {
  const supabase = createClient();
  const { tag_ids, variants, ...baseData } = updates;

  if (Object.keys(baseData).length > 0) {
    const { error: updateError } = await supabase
      .from('products')
      .update(baseData)
      .eq('id', id);

    if (updateError) throw updateError;
  }

  if (tag_ids !== undefined) {
    await supabase.from('product_tags').delete().eq('product_id', id);
    if (tag_ids.length > 0) {
      const newTags = tag_ids.map((tagId: string) => ({
        product_id: id,
        tag_id: tagId,
      }));
      const { error: tagError } = await supabase.from('product_tags').insert(newTags);
      if (tagError) throw tagError;
    }
  }

  return true;
};

export const deleteProduct = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const updateStockGrams = async (id: string, delta: number) => {
  const supabase = createClient();
  // Fetch current
  const { data: current, error: fetchErr } = await supabase
    .from('products')
    .select('stock_grams')
    .eq('id', id)
    .single();

  if (fetchErr || !current) throw fetchErr || new Error('Product not found');

  const newStock = Math.max(0, Number(current.stock_grams) + delta);

  const { error } = await supabase
    .from('products')
    .update({ stock_grams: newStock })
    .eq('id', id);

  if (error) throw error;
  return newStock;
};

export const updateVariantStock = async (variantId: string, delta: number) => {
  const supabase = createClient();
  const { data: current, error: fetchErr } = await supabase
    .from('flacon_variants')
    .select('stock_units')
    .eq('id', variantId)
    .single();

  if (fetchErr || !current) throw fetchErr || new Error('Variant not found');

  const newStock = Math.max(0, Number(current.stock_units) + delta);

  const { error } = await supabase
    .from('flacon_variants')
    .update({ stock_units: newStock })
    .eq('id', variantId);

  if (error) throw error;
  return newStock;
};

// Alias used by ProductModal
export const addProduct = createProduct;
