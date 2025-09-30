-- ================================================================
-- SCRIPT: Create Test Users for Role Testing
-- Description: Creates test users for each role (user, director, ceo, csm)
-- Date: 2025-09-30
-- Instructions: Run this in Supabase SQL Editor
-- ================================================================

-- IMPORTANT: Supabase Auth users are created via auth.users
-- We need to insert users with specific user_metadata containing the role
-- This script uses Supabase's administrative functions

-- ================================================================
-- Create test users with different roles
-- ================================================================

-- 1. USER ROLE: Regular employee
-- Email: user@nevent.es
-- Password: Test1234!
-- Role: user

-- 2. DIRECTOR ROLE: Department director
-- Email: director@nevent.es
-- Password: Test1234!
-- Role: director

-- 3. CEO ROLE: Chief Executive Officer
-- Email: ceo@nevent.es
-- Password: Test1234!
-- Role: ceo

-- 4. CSM ROLE: Customer Success Manager
-- Email: csm@nevent.es
-- Password: Test1234!
-- Role: csm

-- ================================================================
-- INSTRUCTIONS TO CREATE USERS:
-- ================================================================
-- Since Supabase doesn't allow direct INSERT into auth.users,
-- you need to create these users via the Supabase Dashboard:
--
-- 1. Go to: Authentication > Users > Add User
-- 2. Create each user with:
--    - Email: [role]@nevent.es
--    - Password: Test1234!
--    - Auto Confirm: YES
--
-- 3. After creating, run the UPDATE statements below to set roles
-- ================================================================

-- Wait for users to be created, then update their metadata with roles
-- Replace the UUIDs with actual user IDs from auth.users table

-- Example UPDATE (replace UUIDs after creating users):
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "user"}'
-- WHERE email = 'user@nevent.es';

-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "director"}'
-- WHERE email = 'director@nevent.es';

-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "ceo"}'
-- WHERE email = 'ceo@nevent.es';

-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "csm"}'
-- WHERE email = 'csm@nevent.es';

-- ================================================================
-- ALTERNATIVE: Use Supabase Admin API or create via Dashboard
-- ================================================================

-- Create a users table to store additional profile data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'director', 'ceo', 'csm')),
  department_id TEXT REFERENCES departments(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_department ON public.users(department_id);

COMMENT ON TABLE public.users IS 'Extended user profiles with roles and department assignments';

-- ================================================================
-- INSERT TEST USERS (run after auth.users are created)
-- ================================================================

-- These will be linked to auth.users by email
-- You need to get the actual UUIDs from auth.users after creating them

-- Placeholder inserts (replace UUIDs with real ones)
INSERT INTO public.users (id, email, full_name, role, department_id) VALUES
  -- Get UUID from auth.users where email = 'user@nevent.es'
  ('00000000-0000-0000-0000-000000000001', 'user@nevent.es', 'Usuario Test', 'user', NULL),
  ('00000000-0000-0000-0000-000000000002', 'director@nevent.es', 'Director Test', 'director', 'dept-marketing'),
  ('00000000-0000-0000-0000-000000000003', 'ceo@nevent.es', 'CEO Test', 'ceo', NULL),
  ('00000000-0000-0000-0000-000000000004', 'csm@nevent.es', 'CSM Test', 'csm', 'dept-customer-success')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- AUTOMATIC USER PROFILE CREATION TRIGGER
-- ================================================================

-- Create a function that automatically creates a profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- QUERY TO GET USER IDs AFTER CREATION
-- ================================================================

-- Run this after creating users in Supabase Dashboard
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email IN ('user@nevent.es', 'director@nevent.es', 'ceo@nevent.es', 'csm@nevent.es')
ORDER BY email;

-- ================================================================
-- SUMMARY
-- ================================================================
-- Test Users Created:
-- 1. user@nevent.es (password: Test1234!) - Role: user
-- 2. director@nevent.es (password: Test1234!) - Role: director
-- 3. ceo@nevent.es (password: Test1234!) - Role: ceo
-- 4. csm@nevent.es (password: Test1234!) - Role: csm
--
-- All users have the same password for easy testing: Test1234!
-- ================================================================