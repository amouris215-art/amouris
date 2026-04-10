import { createClient } from '@/lib/supabase/client';


export const fetchBrands = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase.from('brands').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createBrand = async (brandData: any) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('brands').insert([brandData]).select().single();
  if (error) throw error;
  return data;
};

export const updateBrand = async (id: string, updates: any) => {
  const supabase = createClient();
  const { error } = await supabase.from('brands').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteBrand = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
  return true;
};
