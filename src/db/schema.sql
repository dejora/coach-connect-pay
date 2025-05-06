
-- Create an enum for user roles (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'coach', 'admin');
    END IF;
END $$;

-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  bio TEXT,
  profile_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create coach_profiles table with coach-specific information
CREATE TABLE IF NOT EXISTS public.coach_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  hourly_rate NUMERIC NOT NULL DEFAULT 50,
  expertise TEXT[] DEFAULT '{}',
  rating NUMERIC,
  years_experience INTEGER DEFAULT 0,
  availability_schedule JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create student_profiles table with student-specific information
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  education_level TEXT,
  subjects_of_interest TEXT[] DEFAULT '{}',
  goals TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profile table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" 
        ON public.profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" 
        ON public.profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Coach profiles are viewable by everyone') THEN
        CREATE POLICY "Coach profiles are viewable by everyone" 
        ON public.profiles 
        FOR SELECT 
        USING (role = 'coach');
    END IF;
END $$;

-- Coach profiles policies (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_profiles' AND policyname = 'Coaches can update their own coach profile') THEN
        CREATE POLICY "Coaches can update their own coach profile" 
        ON public.coach_profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_profiles' AND policyname = 'Coach profiles are viewable by everyone') THEN
        CREATE POLICY "Coach profiles are viewable by everyone" 
        ON public.coach_profiles 
        FOR SELECT 
        TO authenticated
        USING (true);
    END IF;
END $$;

-- Student profiles policies (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'student_profiles' AND policyname = 'Students can update their own student profile') THEN
        CREATE POLICY "Students can update their own student profile" 
        ON public.student_profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'student_profiles' AND policyname = 'Students can view their own profile') THEN
        CREATE POLICY "Students can view their own profile" 
        ON public.student_profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;
END $$;

-- Create function to handle new user registration (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    (NEW.raw_user_meta_data->>'role')::user_role
  );
  
  -- Create coach or student profile based on role
  IF (NEW.raw_user_meta_data->>'role')::user_role = 'coach' THEN
    INSERT INTO public.coach_profiles (id)
    VALUES (NEW.id);
  ELSIF (NEW.raw_user_meta_data->>'role')::user_role = 'student' THEN
    INSERT INTO public.student_profiles (id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for new user registration (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Create indexes for performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_hourly_rate ON public.coach_profiles(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_rating ON public.coach_profiles(rating);
