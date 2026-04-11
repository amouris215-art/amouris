import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing URL or SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkUsers() {
  console.log('Fetching users...');
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError);
    return;
  }
  
  console.log('Total users:', usersData.users.length);
  usersData.users.forEach(u => {
    console.log(`- ${u.email} (${u.id})`);
  });

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return;
  }

  console.log('\nProfiles:');
  profiles.forEach(p => {
    console.log(`- ID: ${p.id}, Email: ${usersData.users.find(u => u.id === p.id)?.email}, Role: ${p.role}`);
  });
}

checkUsers().catch(console.error);
