import { createClient } from '@/lib/supabase/client';


export const fetchTags = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase.from('tags').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createTag = async (tagData: any) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('tags').insert([tagData]).select().single();
  if (error) throw error;
  return data;
};

export const updateTag = async (id: string, updates: any) => {
  const supabase = createClient();
  const { error } = await supabase.from('tags').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteTag = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
  return true;
};
