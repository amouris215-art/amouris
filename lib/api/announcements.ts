import { createClient } from '@/lib/supabase/client';

import { createAdminClient } from '@/lib/supabase/admin';

export const fetchAnnouncements = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase.from('announcements').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return data;
};

export const createAnnouncement = async (annData: any) => {
  const admin = createAdminClient();
  const { data, error } = await admin.from('announcements').insert([annData]).select().single();
  if (error) throw error;
  return data;
};

export const updateAnnouncement = async (id: string, updates: any) => {
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteAnnouncement = async (id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const toggleAnnouncementActive = async (id: string, is_active: boolean) => {
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').update({ is_active }).eq('id', id);
  if (error) throw error;
  return true;
};
