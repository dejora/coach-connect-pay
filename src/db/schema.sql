
-- Create an enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'coach', 'admin');

-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  bio TEXT,
  profile_image TEXT,
  hourly_rate NUMERIC,
  expertise TEXT[],
  rating NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create appointments table to track bookings
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL,
  student_id UUID NOT NULL,
  time_slot_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create coach_time_slots table to track available slots
CREATE TABLE IF NOT EXISTS public.coach_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_coach_id ON public.appointments(coach_id);
CREATE INDEX IF NOT EXISTS idx_appointments_student_id ON public.appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_timeslots_coach_id ON public.coach_time_slots(coach_id);
CREATE INDEX IF NOT EXISTS idx_timeslots_start_time ON public.coach_time_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- This script is for local PostgreSQL setup
-- For production with Supabase, you would also need RLS policies and auth setup
-- See supabase/migrations/ directory for those details
