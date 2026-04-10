'use server'

import { createAdminClient } from '@/lib/supabase/admin';

export const fetchAllCustomers = async () => {
  const admin = createAdminClient();
  
  const { data, error } = await admin
    .from('profiles')
    .select(`
      *,
      orders:orders(count),
      total_spent:orders(total_amount)
    `)
    .eq('role', 'customer');

  if (error) throw error;

  return data.map((customer: any) => ({
    ...customer,
    order_count: customer.orders[0]?.count || 0,
    total_spent: customer.total_spent.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0)
  }));
};

export const fetchCustomerById = async (id: string) => {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .select(`
      *,
      orders:orders(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateCustomerProfile = async (id: string, data: any) => {
  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return profile;
};

export const freezeCustomer = async (id: string, isFrozen: boolean = true) => {
  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ is_frozen: isFrozen })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const deleteCustomer = async (id: string) => {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw error;
  return true;
};

export const resetCustomerPassword = async (id: string, newPassword: string) => {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(id, {
    password: newPassword
  });
  if (error) throw error;
  return true;
};
