-- ================================================================
-- ADD STATUS COLUMN TO DEPARTMENTS
-- Execute this in Supabase SQL Editor
-- ================================================================

-- Add status column if it doesn't exist
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Add other missing columns from schema
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS director_id UUID REFERENCES auth.users(id);

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS budget JSONB DEFAULT '{"allocated": 0, "spent": 0, "currency": "EUR"}'::jsonb;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS okrs JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100);

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have status = 'active'
UPDATE public.departments SET status = 'active' WHERE status IS NULL;

-- Verify
SELECT id, name, status, created_at FROM public.departments ORDER BY name;
