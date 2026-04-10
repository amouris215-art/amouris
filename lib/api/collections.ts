import { createClient } from '@/lib/supabase/client';


export const fetchCollections = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createCollection = async (collData: any) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('collections').insert([collData]).select().single();
  if (error) throw error;
  return data;
};

export const updateCollection = async (id: string, updates: any) => {
  const supabase = createClient();
  const { error } = await supabase.from('collections').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteCollection = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
  return true;
};
