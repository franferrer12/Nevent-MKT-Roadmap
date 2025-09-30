-- ================================================================
-- PRODUCTION SETUP: Complete Database Schema
-- Nevent Strategic Execution Platform v3.0.0
-- Run this in Supabase SQL Editor ONCE before deploying
-- ================================================================

-- ================================================================
-- 1. USERS TABLE (Extended auth profiles)
-- ================================================================
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

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department_id);

COMMENT ON TABLE public.users IS 'Extended user profiles with roles and department assignments';

-- ================================================================
-- 2. AUTOMATIC USER PROFILE CREATION TRIGGER
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Determine role based on email domain
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- 3. CUSTOMERS TABLE (Customer Success)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  crm_id TEXT,
  mrr NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'prospect', 'churned')),
  csm_user_id UUID REFERENCES public.users(id),
  health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  onboarding_completed BOOLEAN DEFAULT false,
  first_event_date DATE,
  last_qbr_date DATE,
  events_created INTEGER DEFAULT 0,
  total_attendees INTEGER DEFAULT 0,
  activation_percent INTEGER DEFAULT 0 CHECK (activation_percent >= 0 AND activation_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_csm ON public.customers(csm_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_health ON public.customers(health_score);

COMMENT ON TABLE public.customers IS 'Customer Success tracking with health scores and metrics';

-- ================================================================
-- 4. DEPARTMENTS (Already exists, but ensuring data)
-- ================================================================
INSERT INTO public.departments (id, name, budget, parent_id, created_at) VALUES
  ('dept-marketing', 'Marketing', 150000, NULL, NOW()),
  ('dept-sales', 'Sales', 200000, NULL, NOW()),
  ('dept-product', 'Product', 300000, NULL, NOW()),
  ('dept-engineering', 'Engineering', 400000, NULL, NOW()),
  ('dept-customer-success', 'Customer Success', 100000, NULL, NOW()),
  ('dept-operations', 'Operations', 120000, NULL, NOW()),
  ('dept-finance', 'Finance', 80000, NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  budget = EXCLUDED.budget,
  updated_at = NOW();

-- ================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Customers policies
DROP POLICY IF EXISTS "CSM/Director/CEO can view customers" ON public.customers;
CREATE POLICY "CSM/Director/CEO can view customers"
  ON public.customers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('csm', 'director', 'ceo')
    )
  );

DROP POLICY IF EXISTS "CSM/Director/CEO can insert customers" ON public.customers;
CREATE POLICY "CSM/Director/CEO can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('csm', 'director', 'ceo')
    )
  );

DROP POLICY IF EXISTS "CSM/Director/CEO can update customers" ON public.customers;
CREATE POLICY "CSM/Director/CEO can update customers"
  ON public.customers FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('csm', 'director', 'ceo')
    )
  );

DROP POLICY IF EXISTS "CSM/Director/CEO can delete customers" ON public.customers;
CREATE POLICY "CSM/Director/CEO can delete customers"
  ON public.customers FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE role IN ('csm', 'director', 'ceo')
    )
  );

-- Company OKRs policies
DROP POLICY IF EXISTS "Everyone can view company OKRs" ON public.company_okrs;
CREATE POLICY "Everyone can view company OKRs"
  ON public.company_okrs FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Only CEO can manage company OKRs" ON public.company_okrs;
CREATE POLICY "Only CEO can manage company OKRs"
  ON public.company_okrs FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'ceo'
    )
  );

-- User OKRs policies
DROP POLICY IF EXISTS "Users can view own OKRs" ON public.user_okrs;
CREATE POLICY "Users can view own OKRs"
  ON public.user_okrs FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  ));

DROP POLICY IF EXISTS "Users can manage own OKRs" ON public.user_okrs;
CREATE POLICY "Users can manage own OKRs"
  ON public.user_okrs FOR ALL
  USING (auth.uid() = user_id);

-- Initiatives policies
DROP POLICY IF EXISTS "Users can view own initiatives" ON public.initiatives;
CREATE POLICY "Users can view own initiatives"
  ON public.initiatives FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  ));

DROP POLICY IF EXISTS "Users can manage own initiatives" ON public.initiatives;
CREATE POLICY "Users can manage own initiatives"
  ON public.initiatives FOR ALL
  USING (auth.uid() = user_id);

-- Actions policies
DROP POLICY IF EXISTS "Users can view all actions" ON public.actions;
CREATE POLICY "Users can view all actions"
  ON public.actions FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can manage own actions" ON public.actions;
CREATE POLICY "Users can manage own actions"
  ON public.actions FOR ALL
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('director', 'ceo'))
  );

-- ================================================================
-- 6. VERIFY SETUP
-- ================================================================
SELECT
  'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'departments', COUNT(*) FROM public.departments
UNION ALL
SELECT 'customers', COUNT(*) FROM public.customers
UNION ALL
SELECT 'company_okrs', COUNT(*) FROM public.company_okrs
UNION ALL
SELECT 'user_okrs', COUNT(*) FROM public.user_okrs
UNION ALL
SELECT 'initiatives', COUNT(*) FROM public.initiatives
UNION ALL
SELECT 'actions', COUNT(*) FROM public.actions;

-- ================================================================
-- SETUP COMPLETE
-- ================================================================
-- Next steps:
-- 1. Create test users in Authentication > Users
-- 2. Verify trigger created profiles in public.users
-- 3. Run application tests
-- ================================================================