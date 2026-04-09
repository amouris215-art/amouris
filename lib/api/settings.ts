'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const fetchSettings = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateSettings = async (updates: any) => {
  const admin = createAdminClient();
  
  // Try to update, if fails, insert (Upsert)
  const { data: existing } = await admin.from('settings').select('id').single();
  
  if (existing) {
    const { error } = await admin.from('settings').update(updates).eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await admin.from('settings').insert([updates]);
    if (error) throw error;
  }

  return true;
};
