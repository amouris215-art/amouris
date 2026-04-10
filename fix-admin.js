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

async function ensureAdmin() {
  const EMAIL = 'admin@amouris-parfums.com';
  
  console.log('Fetching users...');
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError);
    return;
  }
  
  let adminUser = usersData.users.find(u => u.email === EMAIL);
  
  if (!adminUser) {
    console.log(`Admin user ${EMAIL} not found. Creating...`);
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: 'AdminPassword123!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'Amouris',
        phone: '0000000000',
        wilaya: 'Alger',
        role: 'admin'
      }
    });
    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    adminUser = createData.user;
    console.log('Admin user created:', adminUser.id);
  } else {
    console.log('Admin user found:', adminUser.id);
  }
  
  // Update or insert into profiles
  console.log('Checking profile...');
  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', adminUser.id)
    .maybeSingle();
    
  if (dbError && dbError.code !== 'PGRST116') {
    console.error('Error fetching profile:', dbError);
    return;
  }
  
  if (!profile) {
    console.log('Profile not found, inserting...');
    const { error: insertError } = await supabase.from('profiles').insert({
      id: adminUser.id,
      role: 'admin',
      first_name: 'Admin',
      last_name: 'Amouris'
    });
    if (insertError) console.error('Insert error:', insertError);
    else console.log('Admin profile created!');
  } else if (profile.role !== 'admin') {
    console.log('Profile exists but not admin, updating...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminUser.id);
    if (updateError) console.error('Update error:', updateError);
    else console.log('Admin profile updated!');
  } else {
    console.log('Admin profile is correct.', profile);
  }
}

ensureAdmin().catch(console.error);
