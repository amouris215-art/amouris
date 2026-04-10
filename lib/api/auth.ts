import { createClient } from '@/lib/supabase/client';


export const registerCustomer = async (data: any) => {
  const supabase = createClient();
  const { phone, password, ...profileData } = data;
  
  // Format fake email: phone@amouris-client.com
  const email = `${phone}@amouris-client.com`;
  const generatedPassword = password || `pwd_${phone}_${Math.random().toString(36).slice(2,8)}`;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password: generatedPassword,
    options: {
      data: {
        phone,
        ...profileData
      }
    }
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: signUpData };
};

export const loginCustomer = async (phone: string, password?: string) => {
  const supabase = createClient();
  const email = `${phone}@amouris-client.com`;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password || `pwd_${phone}_DEFAULT` // fallback if old users
  });

  if (error) return { ok: false, error: error.message };

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return { ok: true, profile };
};

export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
};

export const loginAdmin = async (email: string, password: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { ok: false, error: error.message };

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut();
    return { ok: false, error: 'Accès non autorisé' };
  }

  return { ok: true, profile };
};
