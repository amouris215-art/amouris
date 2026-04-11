-- 1. Create a security definer function to check if a phone exists
-- This allows unauthenticated users to check if a number is taken without exposing the profiles table
CREATE OR REPLACE FUNCTION public.check_phone_exists(p_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE phone = p_phone
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Make the profile creation trigger more robust
-- Handles potential key mismatches and ensures defaults
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
    role
  )
  VALUES (
    new.id,
    v_first_name,
    v_last_name,
    v_phone,
    v_shop_name,
    v_wilaya,
    v_commune,
    v_role
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
  WHEN OTHERS THEN
    -- Log error or handle gracefully
    -- In Supabase, RAISE EXCEPTION will roll back the auth.user creation
    RAISE EXCEPTION 'Profile creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
