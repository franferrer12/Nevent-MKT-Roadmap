-- ================================================================
-- FIX DEPARTMENTS RLS POLICY
-- Allow everyone to read departments
-- ================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;

-- Create new policy allowing all authenticated users to read
CREATE POLICY "Everyone can view departments"
  ON public.departments FOR SELECT
  USING (true);

-- Verify departments are now readable
SELECT COUNT(*) as total_departments FROM public.departments;
