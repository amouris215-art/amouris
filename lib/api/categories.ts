'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export const fetchCategories = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name_fr', { ascending: true });

  if (error) throw error;
  return data;
};

export const createCategory = async (data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from('categories').insert([data]).select().single();
  if (error) throw error;
  return item;
};

export const updateCategory = async (id: string, data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from('categories').update(data).eq('id', id).select().single();
  if (error) throw error;
  return item;
};

export const deleteCategory = async (id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.from('categories').delete().eq('id', id);
  if (error) throw error;
  return true;
};
