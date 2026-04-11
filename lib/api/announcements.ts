import { createClient } from '@/lib/supabase/client';

export const fetchAnnouncements = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('announcements').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return data;
};

export const createAnnouncement = async (annData: any) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('announcements').insert([annData]).select().single();
  if (error) throw error;
  return data;
};

export const updateAnnouncement = async (id: string, updates: any) => {
  const supabase = createClient();
  const { error } = await supabase.from('announcements').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteAnnouncement = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const toggleAnnouncementActive = async (id: string, is_active: boolean) => {
  const supabase = createClient();
  const { error } = await supabase.from('announcements').update({ is_active }).eq('id', id);
  if (error) throw error;
  return true;
};
