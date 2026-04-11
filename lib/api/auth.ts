import { createClient } from '@/lib/supabase/client';
import { phoneToEmail } from '@/lib/utils/phone';


export const registerCustomer = async (data: any) => {
  const supabase = createClient();
  const { phone, password, firstName, lastName, shopName, wilaya, commune } = data;
  
  // 1. Check if phone already exists using secure RPC
  const { data: exists, error: checkError } = await supabase.rpc('check_phone_exists', { p_phone: phone });
  if (checkError) {
    console.error('Check phone error:', checkError);
  } else if (exists) {
    return { ok: false, error: 'Ce numéro est déjà enregistré' };
  }

  // Format fake email: phone@amouris.app
  const email = phoneToEmail(phone);
  const generatedPassword = password || `pwd_${phone}_${Math.random().toString(36).slice(2,8)}`;

  // 2. Map data for trigger (ensuring snake_case for DB)
  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password: generatedPassword,
    options: {
      data: {
        phone,
        first_name: firstName,
        last_name: lastName,
        shop_name: shopName || null,
        wilaya: wilaya || 'Alger',
        commune: commune || null,
        role: 'customer'
      }
    }
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: signUpData };
};

export const loginCustomer = async (phone: string, password?: string) => {
  const supabase = createClient();
  const email = phoneToEmail(phone);
  
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
