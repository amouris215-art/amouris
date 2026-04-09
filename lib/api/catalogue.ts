'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// --- Generic Helpers ---

const fetchAll = async (table: string, orderCol = 'name_fr') => {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select('*').order(orderCol);
  if (error) throw error;
  return data;
};

const createItem = async (table: string, data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from(table).insert([data]).select().single();
  if (error) throw error;
  return item;
};

const updateItem = async (table: string, id: string, data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from(table).update(data).eq('id', id).select().single();
  if (error) throw error;
  return item;
};

const deleteItem = async (table: string, id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
};

// --- Exports ---

export const fetchCategories = () => fetchAll('categories');
export const fetchBrands = () => fetchAll('brands', 'name');
export const fetchTags = () => fetchAll('tags');
export const fetchCollections = () => fetchAll('collections');

export const categoryApi = {
  create: (data: any) => createItem('categories', data),
  update: (id: string, data: any) => updateItem('categories', id, data),
  remove: (id: string) => deleteItem('categories', id),
};

export const brandApi = {
  create: (data: any) => createItem('brands', data),
  update: (id: string, data: any) => updateItem('brands', id, data),
  remove: (id: string) => deleteItem('brands', id),
};

export const collectionApi = {
  create: (data: any) => createItem('collections', data),
  update: (id: string, data: any) => updateItem('collections', id, data),
  remove: (id: string) => deleteItem('collections', id),
};

export const tagApi = {
  create: (data: any) => createItem('tags', data),
  update: (id: string, data: any) => updateItem('tags', id, data),
  remove: (id: string) => deleteItem('tags', id),
};
