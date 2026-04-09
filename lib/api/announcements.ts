'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const fetchAnnouncements = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createAnnouncement = async (data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from('announcements').insert([data]).select().single();
  if (error) throw error;
  return item;
};

export const updateAnnouncement = async (id: string, data: any) => {
  const admin = createAdminClient();
  const { data: item, error } = await admin.from('announcements').update(data).eq('id', id).select().single();
  if (error) throw error;
  return item;
};

export const deleteAnnouncement = async (id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const toggleAnnouncementActive = async (id: string, active: boolean) => {
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').update({ is_active: active }).eq('id', id);
  if (error) throw error;
  return true;
};
