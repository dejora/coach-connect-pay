-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure policy that allows users to see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (id = auth.uid());

-- Create a policy for viewing coach public information (excluding sensitive data like email)
-- This will require application-level filtering since RLS policies apply to entire rows
-- We'll create a secure function to get public coach data
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_coach_profiles() TO authenticated;