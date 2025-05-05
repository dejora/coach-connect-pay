
-- Create appointments table to track bookings
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_coach_id ON public.appointments(coach_id);
CREATE INDEX IF NOT EXISTS idx_appointments_student_id ON public.appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_timeslots_coach_id ON public.coach_time_slots(coach_id);
CREATE INDEX IF NOT EXISTS idx_timeslots_start_time ON public.coach_time_slots(start_time);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_time_slots ENABLE ROW LEVEL SECURITY;

-- Policy for students to view their own appointments
CREATE POLICY "students_view_own_appointments" 
  ON public.appointments
  FOR SELECT 
  USING (student_id = auth.uid());

-- Policy for coaches to view appointments where they are the coach
CREATE POLICY "coaches_view_own_appointments" 
  ON public.appointments
  FOR SELECT 
  USING (coach_id = auth.uid());

-- Policy for viewing available time slots
CREATE POLICY "view_available_time_slots" 
  ON public.coach_time_slots
  FOR SELECT 
  USING (true);

-- Policy for coaches to manage their time slots
CREATE POLICY "coaches_manage_own_time_slots" 
  ON public.coach_time_slots
  FOR ALL
  USING (coach_id = auth.uid());
