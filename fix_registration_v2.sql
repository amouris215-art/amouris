-- =============================================
-- FIX: "Database error saving new user" 
-- Root cause: handle_new_user() trigger mismatch with profiles table
-- =============================================

-- Step 1: Add the missing 'updated_at' column to profiles (if missing)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to profiles';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
END $$;

-- Step 2: Recreate the handle_new_user() trigger function
-- This version is robust: handles both camelCase and snake_case metadata keys,
-- uses ON CONFLICT for idempotency, and has proper error handling
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
  -- Extract metadata with fallbacks for both camelCase and snake_case
  v_first_name := COALESCE(new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'firstName', '');
  v_last_name  := COALESCE(new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'lastName', '');
  v_phone      := COALESCE(new.raw_user_meta_data->>'phone', '');
  v_shop_name  := COALESCE(new.raw_user_meta_data->>'shop_name', new.raw_user_meta_data->>'shopName', NULL);
  v_wilaya     := COALESCE(new.raw_user_meta_data->>'wilaya', 'Alger');
  v_commune    := COALESCE(new.raw_user_meta_data->>'commune', NULL);
  v_role       := COALESCE(new.raw_user_meta_data->>'role', 'customer');

  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    phone, 
    shop_name,
    wilaya, 
    commune,
    role,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    v_first_name,
    v_last_name,
    v_phone,
    v_shop_name,
    v_wilaya,
    v_commune,
    v_role,
    NOW(),
    NOW()
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
    -- Phone number already taken - raise a clear error
    RAISE EXCEPTION 'Phone number already registered: %', v_phone;
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user failed for user %: % %', new.id, SQLERRM, SQLSTATE;
    RAISE EXCEPTION 'Profile creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Ensure the trigger exists and points to the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Ensure check_phone_exists RPC exists
CREATE OR REPLACE FUNCTION public.check_phone_exists(p_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE phone = p_phone
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Ensure RLS allows the trigger to insert profiles
-- The trigger uses SECURITY DEFINER so it bypasses RLS.
-- But let's also add an INSERT policy as a safety net for edge cases.
DO $$
BEGIN
    -- Drop existing insert policy if any
    DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Trigger can insert profiles" ON public.profiles;
    
    -- Create policy allowing inserts (the trigger runs as SECURITY DEFINER,
    -- but Supabase Auth sometimes needs this)
    CREATE POLICY "Allow profile creation on signup" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
        
    RAISE NOTICE 'RLS insert policy created for profiles';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Insert policy already exists';
END $$;

-- Done! Test by creating a new account.
