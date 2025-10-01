-- ================================================================
-- FIX: Company OKRs RLS Policies
-- Description: Replace user_approvals-based policies with users-based policies
-- Date: 2025-10-01
-- ================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "CEO can manage company OKRs" ON company_okrs;
DROP POLICY IF EXISTS "All can read company OKRs" ON company_okrs;

-- Create new policies based on users table
CREATE POLICY "CEO can manage company OKRs"
ON company_okrs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'ceo'
  )
);

CREATE POLICY "All authenticated users can read company OKRs"
ON company_okrs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
  )
);

SELECT 'Company OKRs RLS policies fixed' AS status;
