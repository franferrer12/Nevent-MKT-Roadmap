-- ================================================================
-- CRITICAL FIXES FOR PRODUCTION
-- Execute this ONCE in Supabase SQL Editor
-- ================================================================

-- 1. Ensure public.users table exists with correct schema
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'director', 'ceo', 'csm')),
  department_id TEXT REFERENCES departments(id),  -- TEXT not INTEGER
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department_id);

-- 2. Create trigger to auto-create user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Determine role based on email
  IF NEW.email LIKE 'ceo@%' THEN
    user_role := 'ceo';
  ELSIF NEW.email LIKE 'director@%' THEN
    user_role := 'director';
  ELSIF NEW.email LIKE 'csm@%' THEN
    user_role := 'csm';
  ELSE
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  END IF;

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies (referencing user_approvals)
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- 5. Create correct policies
CREATE POLICY "Anyone can view users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- 6. Fix departments RLS
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;
CREATE POLICY "Everyone can view departments"
  ON public.departments FOR SELECT
  USING (true);

-- 7. Sync existing auth.users to public.users
INSERT INTO public.users (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email),
  CASE
    WHEN email LIKE 'ceo@%' THEN 'ceo'
    WHEN email LIKE 'director@%' THEN 'director'
    WHEN email LIKE 'csm@%' THEN 'csm'
    ELSE COALESCE(raw_user_meta_data->>'role', 'user')
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 8. Verify setup
SELECT 'Setup verification:' as message;
SELECT 'Users table:' as check, COUNT(*) as count FROM public.users;
SELECT 'Departments table:' as check, COUNT(*) as count FROM public.departments;
SELECT 'Test users:' as check, email, role FROM public.users WHERE email LIKE '%@nevent.es' ORDER BY email;

-- Done!
SELECT '✅ Critical fixes applied successfully!' as status;
