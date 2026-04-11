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

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';

async function ensureAdmin() {
  console.log('=== Step 1: List all users ===');
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError.message);
    return;
  }

  console.log(`Found ${usersData.users.length} users`);
  usersData.users.forEach(u => console.log(`  - ${u.email} (${u.id})`));

  // Check if admin@gmail.com already exists
  let adminUser = usersData.users.find(u => u.email === ADMIN_EMAIL);

  if (adminUser) {
    console.log(`\n=== Step 2: Admin user exists (${adminUser.id}). Updating password... ===`);
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'Amouris',
        phone: '0000000000',
        wilaya: 'Alger',
        role: 'admin'
      }
    });
    if (updateError) {
      console.error('Error updating user:', updateError.message);
      return;
    }
    console.log('Password updated successfully.');
  } else {
    console.log(`\n=== Step 2: Creating admin user ${ADMIN_EMAIL} ===`);
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
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
      console.error('Error creating user:', createError.message);
      return;
    }
    adminUser = createData.user;
    console.log(`Admin user created: ${adminUser.id}`);
  }

  // Step 3: Ensure profile exists with admin role
  console.log('\n=== Step 3: Ensuring admin profile ===');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', adminUser.id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile:', profileError.message);
  }

  if (!profile) {
    console.log('Profile not found. Inserting...');
    const { error: insertError } = await supabase.from('profiles').insert({
      id: adminUser.id,
      role: 'admin',
      first_name: 'Admin',
      last_name: 'Amouris',
      phone: '0000000000',
      wilaya: 'Alger'
    });
    if (insertError) {
      console.error('Insert error:', insertError.message);
    } else {
      console.log('Admin profile created!');
    }
  } else if (profile.role !== 'admin') {
    console.log(`Profile exists with role="${profile.role}". Updating to admin...`);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminUser.id);
    if (updateError) {
      console.error('Update error:', updateError.message);
    } else {
      console.log('Profile updated to admin!');
    }
  } else {
    console.log('Admin profile already correct:', JSON.stringify(profile, null, 2));
  }

  // Step 4: Verify login works
  console.log('\n=== Step 4: Testing login ===');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (loginError) {
    console.error('LOGIN TEST FAILED:', loginError.message);
  } else {
    console.log('LOGIN TEST SUCCESS! User ID:', loginData.user.id);
  }

  console.log('\n=== DONE ===');
}

ensureAdmin().catch(console.error);
