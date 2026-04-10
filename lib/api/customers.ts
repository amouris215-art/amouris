import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';

export const fetchAllCustomers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchCustomerById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const updateCustomer = async (id: string, updates: any) => {
  const supabase = createClient();
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
  return true;
};

export const freezeCustomer = async (id: string, is_frozen: boolean) => {
  const admin = createAdminClient();
  const { error } = await admin.from('profiles').update({ is_frozen }).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteCustomer = async (id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw error;
  return true;
};

export const resetCustomerPassword = async (id: string, newPassword?: string) => {
  const admin = createAdminClient();
  const pwd = newPassword || `pwd_reset_${Math.random().toString(36).slice(2,8)}`;
  const { error } = await admin.auth.admin.updateUserById(id, { password: pwd });
  if (error) throw error;
  return { success: true, password: pwd };
};

// Alias used by SettingsClient
export const updateCustomerProfile = updateCustomer;
