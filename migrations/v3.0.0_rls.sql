-- ================================================================
-- MIGRATION: v3.0.0 - Row Level Security Policies
-- Description: Create RLS policies for all new tables
-- Date: 2025-09-30
-- Author: fran.ferrer@nevent.es
-- ================================================================

-- ================================================================
-- COMPANY OKRs POLICIES
-- ================================================================

-- CEO can manage company OKRs
CREATE POLICY "CEO can manage company OKRs"
ON company_okrs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('admin', 'ceo')
    AND user_approvals.approved = true
  )
);

-- All approved users can read company OKRs
CREATE POLICY "All can read company OKRs"
ON company_okrs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- ================================================================
-- DEPARTMENTS POLICIES
-- ================================================================

-- All approved users can read departments
CREATE POLICY "All can read departments"
ON departments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- Admins and directors can manage departments
CREATE POLICY "Admins and directors can manage departments"
ON departments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('admin', 'ceo')
    AND user_approvals.approved = true
  )
  OR
  director_id = auth.uid()
);

-- ================================================================
-- USER OKRs POLICIES
-- ================================================================

-- All approved users can read OKRs
CREATE POLICY "All can read OKRs"
ON user_okrs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- Users can manage own OKRs
CREATE POLICY "Users can manage own OKRs"
ON user_okrs FOR ALL
USING (user_id = auth.uid());

-- Admins can manage all OKRs
CREATE POLICY "Admins can manage all OKRs"
ON user_okrs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('admin', 'ceo')
    AND user_approvals.approved = true
  )
);

-- ================================================================
-- INITIATIVES POLICIES
-- ================================================================

-- All approved users can read initiatives
CREATE POLICY "All can read initiatives"
ON initiatives FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- Owners can manage their initiatives
CREATE POLICY "Owners can manage initiatives"
ON initiatives FOR ALL
USING (owner_id = auth.uid());

-- Team members can update initiatives
CREATE POLICY "Team members can update initiatives"
ON initiatives FOR UPDATE
USING (auth.uid() = ANY(team_members));

-- Admins can manage all initiatives
CREATE POLICY "Admins can manage all initiatives"
ON initiatives FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('admin', 'ceo')
    AND user_approvals.approved = true
  )
);

-- ================================================================
-- ACTIONS POLICIES (Updated from roadmap_actions)
-- ================================================================

-- Admins have full access
CREATE POLICY "Admins have full access to actions"
ON actions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role = 'admin'
    AND user_approvals.approved = true
  )
);

-- Editors can manage actions
CREATE POLICY "Editors can manage actions"
ON actions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('editor', 'admin')
    AND user_approvals.approved = true
  )
);

-- Viewers can read actions
CREATE POLICY "Viewers can read actions"
ON actions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- ================================================================
-- CUSTOMERS POLICIES (Phase 4)
-- ================================================================

-- All approved users can read customers
CREATE POLICY "All can read customers"
ON customers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- CSM can manage their customers
CREATE POLICY "CSM can manage their customers"
ON customers FOR ALL
USING (csm_user_id = auth.uid());

-- Admins can manage all customers
CREATE POLICY "Admins can manage all customers"
ON customers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('admin', 'ceo')
    AND user_approvals.approved = true
  )
);

-- ================================================================
-- MANUAL METRICS POLICIES (Phase 3)
-- ================================================================

-- All approved users can read metrics
CREATE POLICY "All can read metrics"
ON manual_metrics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- Users can create metrics
CREATE POLICY "Users can create metrics"
ON manual_metrics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('editor', 'admin')
    AND user_approvals.approved = true
  )
);

-- Users can update own metrics
CREATE POLICY "Users can update own metrics"
ON manual_metrics FOR UPDATE
USING (collected_by = auth.uid());

-- Admins can manage all metrics
CREATE POLICY "Admins can manage all metrics"
ON manual_metrics FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role = 'admin'
    AND user_approvals.approved = true
  )
);

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

SELECT 'v3.0.0 RLS Policies Migration Complete' AS status;