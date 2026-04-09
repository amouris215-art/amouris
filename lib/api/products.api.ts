import { createClient } from '../supabase/client';
import { Product, FlaconVariant } from '@/store/products.store';

export const productsApi = {
  async fetchProducts(filters?: { type?: 'perfume' | 'flacon'; category_id?: string; brand_id?: string; status?: 'active' | 'draft' }) {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select(`
        *,
        variants:flacon_variants(*),
        category:categories(*),
        brand:brands(*),
        collection:collections(*),
        tags:product_tags(tag_id, tags(*))
      `);

    if (filters?.type) query = query.eq('product_type', filters.type);
    if (filters?.category_id) query = query.eq('category_id', filters.category_id);
    if (filters?.brand_id) query = query.eq('brand_id', filters.brand_id);
    if (filters?.status) query = query.eq('status', filters.status);
    else query = query.eq('status', 'active');

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Transform to match Zustand store type if necessary
    return (data || []).map(p => ({
      ...p,
      tag_ids: p.tags?.map((t: any) => t.tag_id) || []
    })) as Product[];
  },

  async fetchProductBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:flacon_variants(*),
        category:categories(*),
        brand:brands(*),
        collection:collections(*),
        tags:product_tags(tag_id, tags(*))
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    return {
      ...data,
      tag_ids: data.tags?.map((t: any) => t.tag_id) || []
    } as Product;
  },

  async createProduct(data: any) {
    const supabase = createClient();
    const { variants, tag_ids, ...productData } = data;

    // 1. Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (productError) throw productError;

    // 2. Create variants if any
    if (variants && variants.length > 0) {
      const { error: variantsError } = await supabase
        .from('flacon_variants')
        .insert(variants.map((v: any) => ({ ...v, product_id: product.id })));
      
      if (variantsError) throw variantsError;
    }

    // 3. Create tags associations
    if (tag_ids && tag_ids.length > 0) {
      const { error: tagsError } = await supabase
        .from('product_tags')
        .insert(tag_ids.map((tagId: string) => ({ product_id: product.id, tag_id: tagId })));
      
      if (tagsError) throw tagsError;
    }

    return product;
  },

  async updateProduct(id: string, updates: any) {
    const supabase = createClient();
    const { variants, tag_ids, ...productData } = updates;

    // 1. Update product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (productError) throw productError;

    // 2. Handle variants (This is simplified, should ideally sync variants)
    if (variants) {
      // Delete existing variants and recreate
      await supabase.from('flacon_variants').delete().eq('product_id', id);
      const { error: variantsError } = await supabase
        .from('flacon_variants')
        .insert(variants.map((v: any) => ({ ...v, product_id: id })));
      
      if (variantsError) throw variantsError;
    }

    // 3. Handle tags
    if (tag_ids) {
      await supabase.from('product_tags').delete().eq('product_id', id);
      const { error: tagsError } = await supabase
        .from('product_tags')
        .insert(tag_ids.map((tagId: string) => ({ product_id: id, tag_id: tagId })));
      
      if (tagsError) throw tagsError;
    }

    return product;
  },

  async deleteProduct(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async updateStock(id: string, delta: number, variantId?: string) {
    const supabase = createClient();
    
    if (variantId) {
      // Update flacon variant stock
      const { data: variant, error: fetchError } = await supabase
        .from('flacon_variants')
        .select('stock_units')
        .eq('id', variantId)
        .single();
      
      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('flacon_variants')
        .update({ stock_units: Math.max(0, variant.stock_units + delta) })
        .eq('id', variantId);
      
      if (updateError) throw updateError;
    } else {
      // Update perfume stock (grams)
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock_grams')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_grams: Math.max(0, (product.stock_grams || 0) + delta) })
        .eq('id', id);
      
      if (updateError) throw updateError;
    }
  },

  async fetchCategories() {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name_fr');
    if (error) throw error;
    return data;
  },

  async fetchBrands() {
    const supabase = createClient();
    const { data, error } = await supabase.from('brands').select('*').order('name');
    if (error) throw error;
    return data;
  },

  async fetchCollections() {
    const supabase = createClient();
    const { data, error } = await supabase.from('collections').select('*').order('name_fr');
    if (error) throw error;
    return data;
  },

  async fetchTags() {
    const supabase = createClient();
    const { data, error } = await supabase.from('tags').select('*').order('homepage_order');
    if (error) throw error;
    return data;
  }
};
