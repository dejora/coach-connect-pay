-- Fix the search path security issue for the newly created function
CREATE OR REPLACE FUNCTION public.get_public_coach_profiles()
RETURNS TABLE (
  id uuid,
  name text,
  bio text,
  profile_image text,
  hourly_rate numeric,
  expertise text[],
  rating numeric,
  is_active boolean,
  created_at timestamptz
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    p.bio,
    p.profile_image,
    p.hourly_rate,
    p.expertise,
    p.rating,
    p.is_active,
    p.created_at
  FROM public.profiles p
  WHERE p.role = 'coach' AND p.is_active = true;
$$;

-- Fix the existing handle_new_user function to have immutable search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    NEW.email, 
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$;