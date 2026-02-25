
-- Add missing columns to patient_profiles
ALTER TABLE public.patient_profiles 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS chronic_diseases text,
ADD COLUMN IF NOT EXISTS current_medications text;
