'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function login(phone: string, password: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = `${phone}@amouris.dz`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // Check profile status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role')
    .eq('id', data.user.id)
    .single();

  if (profile?.status === 'frozen') {
    await supabase.auth.signOut();
    throw new Error('Votre compte est gelé. Veuillez contacter l\'administration.');
  }

  revalidatePath('/');
  return { user: data.user, role: profile?.role };
}

export async function logout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  revalidatePath('/');
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile
  };
}
