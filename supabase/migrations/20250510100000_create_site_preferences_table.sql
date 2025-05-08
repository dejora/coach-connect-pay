
-- Create site_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert initial preferences if they don't exist
INSERT INTO public.site_preferences (key, value, description) 
VALUES 
  ('maintenance_mode', 'false'::jsonb, 'Whether the site is in maintenance mode')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_preferences (key, value, description) 
VALUES 
  ('site_url', '"https://coachconnect.app"'::jsonb, 'The main URL of the site')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_preferences (key, value, description) 
VALUES 
  ('default_language', '"en"'::jsonb, 'Default language for the site')
ON CONFLICT (key) DO NOTHING;
