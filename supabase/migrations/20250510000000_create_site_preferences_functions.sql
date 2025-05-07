
-- Create functions to safely access the site_preferences table

-- Function to get all preferences
CREATE OR REPLACE FUNCTION public.get_all_preferences()
RETURNS SETOF public.site_preferences
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.site_preferences;
$$;

-- Function to get preference by key
CREATE OR REPLACE FUNCTION public.get_preference_by_key(preference_key TEXT)
RETURNS public.site_preferences
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.site_preferences 
  WHERE key = preference_key
  LIMIT 1;
$$;

-- Function to update or insert preference
CREATE OR REPLACE FUNCTION public.update_preference(preference_key TEXT, preference_value JSONB)
RETURNS public.site_preferences
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result public.site_preferences;
BEGIN
  -- Try to update existing preference
  UPDATE public.site_preferences
  SET value = preference_value, updated_at = now()
  WHERE key = preference_key
  RETURNING * INTO result;
  
  -- If not found, insert new preference
  IF result.id IS NULL THEN
    INSERT INTO public.site_preferences (key, value)
    VALUES (preference_key, preference_value)
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$;
