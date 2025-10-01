-- ================================================================
-- FIX USERS RLS POLICY
-- Allow anon key to read users (for tests)
-- ================================================================

-- Drop existing restrictive policy if exists
DROP POLICY IF EXISTS "Users can view all users" ON public.users;

-- Create new policy allowing anonymous reads (for tests)
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  USING (true);

-- Verify users are now readable
SELECT COUNT(*) as total_users FROM public.users;
SELECT email, role FROM public.users WHERE email LIKE '%@nevent.es' ORDER BY email;
