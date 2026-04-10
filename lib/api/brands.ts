'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export const fetchBrands = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

export const createBrand = async (data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from('brands').insert([data]).select().single();
  if (error) throw error;
  return item;
};

export const updateBrand = async (id: string, data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from('brands').update(data).eq('id', id).select().single();
  if (error) throw error;
  return item;
};

export const deleteBrand = async (id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.from('brands').delete().eq('id', id);
  if (error) throw error;
  return true;
};
