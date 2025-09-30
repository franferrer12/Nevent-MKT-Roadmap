-- ================================================================
-- MIGRATION: FIX RLS Policies - Remove user_approvals dependency
-- Description: Rewrite all RLS policies to use public.users table
-- Date: 2025-09-30
-- Priority: CRITICAL
-- ================================================================

-- ================================================================
-- 1. DROP ALL EXISTING BROKEN POLICIES
-- ================================================================

-- Company OKRs
DROP POLICY IF EXISTS "CEO can manage company OKRs" ON company_okrs;
DROP POLICY IF EXISTS "All can read company OKRs" ON company_okrs;
DROP POLICY IF EXISTS "Everyone can view company OKRs" ON company_okrs;
DROP POLICY IF EXISTS "Only CEO can manage company OKRs" ON company_okrs;

-- Departments
DROP POLICY IF EXISTS "All can read departments" ON departments;
DROP POLICY IF EXISTS "Admins and directors can manage departments" ON departments;

-- User OKRs
DROP POLICY IF EXISTS "All can read OKRs" ON user_okrs;
DROP POLICY IF EXISTS "Users can manage own OKRs" ON user_okrs;
DROP POLICY IF EXISTS "Admins can manage all OKRs" ON user_okrs;
DROP POLICY IF EXISTS "Users can view own OKRs" ON user_okrs;

-- Initiatives
DROP POLICY IF EXISTS "All can read initiatives" ON initiatives;
DROP POLICY IF EXISTS "Owners can manage initiatives" ON initiatives;
DROP POLICY IF EXISTS "Team members can update initiatives" ON initiatives;
DROP POLICY IF EXISTS "Admins can manage all initiatives" ON initiatives;
DROP POLICY IF EXISTS "Users can view own initiatives" ON initiatives;
DROP POLICY IF EXISTS "Users can manage own initiatives" ON initiatives;

-- Actions
DROP POLICY IF EXISTS "Admins have full access to actions" ON actions;
DROP POLICY IF EXISTS "Editors can manage actions" ON actions;
DROP POLICY IF EXISTS "Viewers can read actions" ON actions;
DROP POLICY IF EXISTS "Users can view all actions" ON actions;
DROP POLICY IF EXISTS "Users can manage own actions" ON actions;

-- Customers
DROP POLICY IF EXISTS "All can read customers" ON customers;
DROP POLICY IF EXISTS "CSM can manage their customers" ON customers;
DROP POLICY IF EXISTS "Admins can manage all customers" ON customers;
DROP POLICY IF EXISTS "CSM/Director/CEO can view customers" ON customers;
DROP POLICY IF EXISTS "CSM/Director/CEO can insert customers" ON customers;
DROP POLICY IF EXISTS "CSM/Director/CEO can update customers" ON customers;
DROP POLICY IF EXISTS "CSM/Director/CEO can delete customers" ON customers;

-- Manual Metrics (if exists)
DROP POLICY IF EXISTS "All can read metrics" ON manual_metrics;
DROP POLICY IF EXISTS "Users can create metrics" ON manual_metrics;
DROP POLICY IF EXISTS "Users can update own metrics" ON manual_metrics;
DROP POLICY IF EXISTS "Admins can manage all metrics" ON manual_metrics;

-- ================================================================
-- 2. CREATE CORRECTED RLS POLICIES USING public.users
-- ================================================================

-- ================================================================
-- USERS TABLE POLICIES
-- ================================================================
CREATE POLICY "Authenticated users can view all users"
ON public.users FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- ================================================================
-- COMPANY OKRs POLICIES
-- ================================================================
CREATE POLICY "Everyone can view company OKRs"
ON public.company_okrs FOR SELECT
USING (
  auth.uid() IS NOT NULL
);

CREATE POLICY "Only CEO can manage company OKRs"
ON public.company_okrs FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'ceo'
  )
);

-- ================================================================
-- DEPARTMENTS POLICIES
-- ================================================================
CREATE POLICY "All authenticated users can view departments"
ON public.departments FOR SELECT
USING (
  auth.uid() IS NOT NULL
);

CREATE POLICY "CEO can manage departments"
ON public.departments FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'ceo'
  )
);

-- ================================================================
-- USER OKRs POLICIES
-- ================================================================
CREATE POLICY "Users can view own OKRs or directors/ceo can view all"
ON public.user_okrs FOR SELECT
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

CREATE POLICY "Users can insert own OKRs"
ON public.user_okrs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own OKRs"
ON public.user_okrs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own OKRs"
ON public.user_okrs FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Directors and CEO can manage all OKRs"
ON public.user_okrs FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

-- ================================================================
-- INITIATIVES POLICIES
-- ================================================================
CREATE POLICY "Users can view own initiatives or directors/ceo can view all"
ON public.initiatives FOR SELECT
USING (
  auth.uid() = owner_id
  OR
  auth.uid() = ANY(team_members)
  OR
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

CREATE POLICY "Owners can insert initiatives"
ON public.initiatives FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and team members can update initiatives"
ON public.initiatives FOR UPDATE
USING (
  auth.uid() = owner_id
  OR
  auth.uid() = ANY(team_members)
);

CREATE POLICY "Owners can delete initiatives"
ON public.initiatives FOR DELETE
USING (auth.uid() = owner_id);

CREATE POLICY "Directors and CEO can manage all initiatives"
ON public.initiatives FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

-- ================================================================
-- ACTIONS POLICIES
-- ================================================================
CREATE POLICY "All authenticated users can view actions"
ON public.actions FOR SELECT
USING (
  auth.uid() IS NOT NULL
);

CREATE POLICY "Assigned users can update their actions"
ON public.actions FOR UPDATE
USING (
  auth.uid() = user_id
);

CREATE POLICY "Directors and CEO can manage all actions"
ON public.actions FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

-- ================================================================
-- CUSTOMERS POLICIES
-- ================================================================
CREATE POLICY "CSM/Director/CEO can view customers"
ON public.customers FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('csm', 'director', 'ceo')
  )
);

CREATE POLICY "CSM/Director/CEO can insert customers"
ON public.customers FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('csm', 'director', 'ceo')
  )
);

CREATE POLICY "CSM can update assigned customers"
ON public.customers FOR UPDATE
USING (
  auth.uid() = csm_user_id
  OR
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

CREATE POLICY "Director and CEO can delete customers"
ON public.customers FOR DELETE
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role IN ('director', 'ceo')
  )
);

-- ================================================================
-- 3. VERIFY RLS IS ENABLED ON ALL TABLES
-- ================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 4. VERIFICATION QUERY
-- ================================================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================
SELECT 'RLS Policies Fixed - user_approvals dependency removed' AS status;