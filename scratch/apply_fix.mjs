import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DIRECT_URL;

if (!databaseUrl) {
  console.error('Missing DIRECT_URL in .env.local');
  process.exit(1);
}

// Use pg to connect directly and run the SQL
import pg from 'pg';
const { Client } = pg;

async function applyFix() {
  console.log('=== APPLYING REGISTRATION FIX ===\n');
  
  const client = new Client({ connectionString: databaseUrl });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Add updated_at if missing
    console.log('Step 1: Checking updated_at column...');
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'updated_at'
    `);
    
    if (colCheck.rows.length === 0) {
      await client.query(`ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW()`);
      console.log('  ✅ Added updated_at column');
    } else {
      console.log('  ✅ updated_at already exists');
    }

    // Step 2: Recreate handle_new_user function
    console.log('\nStep 2: Recreating handle_new_user() trigger function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      DECLARE
        v_first_name TEXT;
        v_last_name TEXT;
        v_phone TEXT;
        v_shop_name TEXT;
        v_wilaya TEXT;
        v_commune TEXT;
        v_role TEXT;
      BEGIN
        v_first_name := COALESCE(new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'firstName', '');
        v_last_name  := COALESCE(new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'lastName', '');
        v_phone      := COALESCE(new.raw_user_meta_data->>'phone', '');
        v_shop_name  := COALESCE(new.raw_user_meta_data->>'shop_name', new.raw_user_meta_data->>'shopName', NULL);
        v_wilaya     := COALESCE(new.raw_user_meta_data->>'wilaya', 'Alger');
        v_commune    := COALESCE(new.raw_user_meta_data->>'commune', NULL);
        v_role       := COALESCE(new.raw_user_meta_data->>'role', 'customer');

        INSERT INTO public.profiles (
          id, first_name, last_name, phone, shop_name, wilaya, commune, role, created_at, updated_at
        )
        VALUES (
          new.id, v_first_name, v_last_name, v_phone, v_shop_name, v_wilaya, v_commune, v_role, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          phone = EXCLUDED.phone,
          shop_name = EXCLUDED.shop_name,
          wilaya = EXCLUDED.wilaya,
          commune = EXCLUDED.commune,
          updated_at = NOW();

        RETURN new;
      EXCEPTION
        WHEN unique_violation THEN
          RAISE EXCEPTION 'Phone number already registered: %', v_phone;
        WHEN OTHERS THEN
          RAISE LOG 'handle_new_user failed for user %: % %', new.id, SQLERRM, SQLSTATE;
          RAISE EXCEPTION 'Profile creation failed: %', SQLERRM;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('  ✅ handle_new_user() recreated');

    // Step 3: Recreate the trigger
    console.log('\nStep 3: Recreating trigger...');
    await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);
    await client.query(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
    `);
    console.log('  ✅ Trigger recreated');

    // Step 4: Ensure check_phone_exists
    console.log('\nStep 4: Ensuring check_phone_exists RPC...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.check_phone_exists(p_phone TEXT)
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('  ✅ check_phone_exists RPC ensured');

    // Step 5: Add INSERT RLS policy for profiles
    console.log('\nStep 5: Ensuring INSERT RLS policy for profiles...');
    await client.query(`DROP POLICY IF EXISTS "Allow profile creation on signup" ON public.profiles`);
    await client.query(`
      CREATE POLICY "Allow profile creation on signup" 
        ON public.profiles FOR INSERT 
        WITH CHECK (auth.uid() = id)
    `);
    console.log('  ✅ INSERT policy created');

    // Step 6: Verify by testing user creation
    console.log('\n--- Verification: Testing user creation ---');
    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const testPhone = `test_${Date.now()}`;
    const testEmail = `${testPhone}@amouris.app`;
    
    const { data: signUpData, error: signUpErr } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'testpassword123',
      email_confirm: true,
      user_metadata: {
        phone: testPhone,
        first_name: 'Test',
        last_name: 'Registration',
        shop_name: null,
        wilaya: 'Alger',
        commune: null,
        role: 'customer'
      }
    });

    if (signUpErr) {
      console.log('  ❌ TEST FAILED:', signUpErr.message);
      console.log('  Full error:', JSON.stringify(signUpErr, null, 2));
    } else {
      console.log('  ✅ Test user created:', signUpData.user.id);
      
      // Check profile
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();

      if (profErr) {
        console.log('  ❌ Profile NOT created:', profErr.message);
      } else {
        console.log('  ✅ Profile created:', JSON.stringify(profile, null, 2));
      }

      // Cleanup
      await supabase.auth.admin.deleteUser(signUpData.user.id);
      console.log('  🧹 Test user cleaned up');
    }

    console.log('\n=== FIX APPLIED SUCCESSFULLY ===');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
