import { createClient } from '@/lib/supabase/client';


export const fetchSettings = async () => {
  
  const supabase = createClient();
  
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  
  // Transform key-value rows back into a single object
  return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
};

export const updateSettings = async (settings: any) => {
  const supabase = createClient();
  const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
  
  if (entries.length > 0) {
    const { error } = await supabase.from('settings').upsert(entries);
    if (error) throw error;
  }
  return true;
};
