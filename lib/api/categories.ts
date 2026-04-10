import { createClient } from '@/lib/supabase/client';


export const fetchCategories = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createCategory = async (catData: any) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').insert([catData]).select().single();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, updates: any) => {
  const supabase = createClient();
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteCategory = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
  return true;
};
