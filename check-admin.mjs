import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing URL or SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function check() {
  console.log('Checking admins...');
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, role, first_name, last_name')
    .eq('role', 'admin');

  if (error) {
    console.error('Error fetching admins:', error);
    return;
  }

  console.log('Admins found:', profiles.length);
  profiles.forEach(p => console.log(`- ${p.first_name} ${p.last_name} (${p.id})`));
}

check().catch(console.error);
