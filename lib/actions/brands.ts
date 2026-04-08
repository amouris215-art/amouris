'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Brand } from '@/lib/types';

export async function getBrands() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return (data || []).map((b: any) => ({
    id: b.id,
    nameAR: b.name_ar,
    nameFR: b.name,
    logo: b.logo_url,
  }));
}

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createBrand(brand: Partial<Brand>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('brands')
    .insert([{ name: brand.nameFR, name_ar: brand.nameAR, logo_url: brand.logo }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/brands');
  return data;
}

export async function updateBrand(id: string, brand: Partial<Brand>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('brands')
    .update({ name: brand.nameFR, name_ar: brand.nameAR, logo_url: brand.logo })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/brands');
  return data;
}

export async function deleteBrand(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/brands');
}
