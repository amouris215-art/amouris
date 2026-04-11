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

async function diagnose() {
  console.log('=== DIAGNOSING REGISTRATION ISSUE ===\n');

  // 1. Check profiles table columns
  console.log('--- 1. Profiles Table Columns ---');
  const { data: cols, error: colsErr } = await supabase.rpc('exec_sql', {
    sql: `SELECT column_name, data_type, is_nullable, column_default 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'profiles' 
          ORDER BY ordinal_position`
  }).maybeSingle();
  
  // Fallback: query directly
  if (colsErr) {
    console.log('  (Using fallback query method)');
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileErr) {
      console.log('  ERROR reading profiles:', profileErr.message);
    } else {
      console.log('  Columns found:', profileData.length > 0 ? Object.keys(profileData[0]).join(', ') : '(table empty, checking schema...)');
    }
  } else {
    console.log('  Columns:', JSON.stringify(cols, null, 2));
  }

  // 2. Check if check_phone_exists function exists
  console.log('\n--- 2. Testing check_phone_exists RPC ---');
  const { data: phoneCheck, error: phoneErr } = await supabase.rpc('check_phone_exists', { p_phone: '0000000000' });
  if (phoneErr) {
    console.log('  PROBLEM: check_phone_exists RPC DOES NOT EXIST or error:', phoneErr.message);
    console.log('  Code:', phoneErr.code);
  } else {
    console.log('  OK: check_phone_exists works. Result for test phone:', phoneCheck);
  }

  // 3. Check existing users and profiles
  console.log('\n--- 3. Existing Auth Users ---');
  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr) {
    console.log('  ERROR:', usersErr.message);
  } else {
    console.log('  Total auth users:', usersData.users.length);
    usersData.users.forEach(u => {
      console.log(`    - ${u.email} | id: ${u.id} | metadata: ${JSON.stringify(u.user_metadata)}`);
    });
  }

  console.log('\n--- 4. Existing Profiles ---');
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('*');
  if (profErr) {
    console.log('  ERROR:', profErr.message, '| Code:', profErr.code, '| Details:', profErr.details);
  } else {
    console.log('  Total profiles:', profiles.length);
    profiles.forEach(p => {
      console.log(`    - id: ${p.id} | phone: ${p.phone} | name: ${p.first_name} ${p.last_name} | role: ${p.role}`);
    });
  }

  // 4. Check for orphaned auth users (users without profiles)
  if (usersData && profiles) {
    console.log('\n--- 5. Orphaned Auth Users (no profile) ---');
    const profileIds = new Set(profiles.map(p => p.id));
    const orphans = usersData.users.filter(u => !profileIds.has(u.id));
    if (orphans.length === 0) {
      console.log('  None found.');
    } else {
      console.log(`  Found ${orphans.length} orphaned auth users:`);
      orphans.forEach(u => {
        console.log(`    - ${u.email} (${u.id})`);
      });
    }
  }

  // 5. Try a test signUp to see the exact error
  console.log('\n--- 6. Test SignUp (with unique test data) ---');
  const testPhone = `test_${Date.now()}`;
  const testEmail = `${testPhone}@amouris.app`;
  const { data: signUpData, error: signUpErr } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'testpassword123',
    email_confirm: true,
    user_metadata: {
      phone: testPhone,
      first_name: 'Test',
      last_name: 'User',
      shop_name: null,
      wilaya: 'Alger',
      commune: null,
      role: 'customer'
    }
  });

  if (signUpErr) {
    console.log('  SIGNUP FAILED:', signUpErr.message);
    console.log('  Status:', signUpErr.status);
    console.log('  Full error:', JSON.stringify(signUpErr, null, 2));
  } else {
    console.log('  SIGNUP SUCCEEDED for test user:', signUpData.user.id);
    
    // Verify profile was created
    const { data: newProfile, error: newProfErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signUpData.user.id)
      .single();
    
    if (newProfErr) {
      console.log('  PROFILE NOT CREATED! Error:', newProfErr.message);
      console.log('  This confirms the handle_new_user() trigger is failing.');
    } else {
      console.log('  Profile created successfully:', JSON.stringify(newProfile, null, 2));
    }

    // Cleanup: delete the test user
    console.log('\n  Cleaning up test user...');
    const { error: delErr } = await supabase.auth.admin.deleteUser(signUpData.user.id);
    if (delErr) {
      console.log('  Warning: Could not delete test user:', delErr.message);
    } else {
      console.log('  Test user cleaned up.');
    }
  }

  console.log('\n=== DIAGNOSIS COMPLETE ===');
}

diagnose().catch(err => {
  console.error('Diagnosis script error:', err);
});
