-- ================================================================
-- MIGRATION: v3.0.0 - Schema Creation
-- Description: Create new tables for OKR hierarchy
-- Date: 2025-09-30
-- Author: fran.ferrer@nevent.es
-- ================================================================

-- ================================================================
-- 1. COMPANY OKRs
-- ================================================================

CREATE TABLE IF NOT EXISTS company_okrs (
  id TEXT PRIMARY KEY,
  fiscal_year TEXT NOT NULL,
  objective TEXT NOT NULL,
  key_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  owner_id UUID REFERENCES auth.users(id),
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_okrs_fiscal_year ON company_okrs(fiscal_year);
CREATE INDEX idx_company_okrs_owner_id ON company_okrs(owner_id);

COMMENT ON TABLE company_okrs IS 'Annual company-level objectives set by CEO/C-Suite';

-- ================================================================
-- 2. DEPARTMENTS
-- ================================================================

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  director_id UUID REFERENCES auth.users(id),
  budget JSONB DEFAULT '{"allocated": 0, "spent": 0, "currency": "EUR"}'::jsonb,
  okrs JSONB DEFAULT '[]'::jsonb,
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_departments_director_id ON departments(director_id);
CREATE INDEX idx_departments_status ON departments(status);

COMMENT ON TABLE departments IS 'Organizational departments with budgets and health tracking';

-- ================================================================
-- 3. USER OKRs
-- ================================================================

CREATE TABLE IF NOT EXISTS user_okrs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  contributes_to TEXT,  -- Department OKR ID or Company OKR ID
  quarter TEXT NOT NULL,
  key_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'off_track', 'completed')),
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_okrs_user_id ON user_okrs(user_id);
CREATE INDEX idx_user_okrs_quarter ON user_okrs(quarter);
CREATE INDEX idx_user_okrs_status ON user_okrs(status);
CREATE INDEX idx_user_okrs_contributes_to ON user_okrs(contributes_to);

COMMENT ON TABLE user_okrs IS 'Individual OKRs for managers and team members';

-- ================================================================
-- 4. INITIATIVES
-- ================================================================

CREATE TABLE IF NOT EXISTS initiatives (
  id TEXT PRIMARY KEY,
  department_id TEXT REFERENCES departments(id),
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id),
  contributes_to_okr TEXT REFERENCES user_okrs(id),
  expected_impact JSONB,  -- { okr_id, kr_id, expected_contribution }
  quarter TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  health TEXT DEFAULT 'on_track' CHECK (health IN ('on_track', 'at_risk', 'off_track')),
  budget_allocated DECIMAL(10,2),
  budget_spent DECIMAL(10,2) DEFAULT 0,
  team_members UUID[],
  blocked_by TEXT[],
  blocks TEXT[],
  kpis JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_initiatives_owner_id ON initiatives(owner_id);
CREATE INDEX idx_initiatives_department_id ON initiatives(department_id);
CREATE INDEX idx_initiatives_status ON initiatives(status);
CREATE INDEX idx_initiatives_health ON initiatives(health);
CREATE INDEX idx_initiatives_okr ON initiatives(contributes_to_okr);

COMMENT ON TABLE initiatives IS 'Strategic projects linked to OKRs with budget and team tracking';

-- ================================================================
-- 5. ACTIONS (Migration from roadmap_actions)
-- ================================================================

-- Rename existing table if migration not done yet
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roadmap_actions') THEN
    ALTER TABLE roadmap_actions RENAME TO actions;
  END IF;
END $$;

-- Add new columns to actions table
ALTER TABLE actions ADD COLUMN IF NOT EXISTS initiative_id TEXT REFERENCES initiatives(id);
ALTER TABLE actions ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(5,2);
ALTER TABLE actions ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(5,2);
ALTER TABLE actions ADD COLUMN IF NOT EXISTS kpi_impact JSONB;

CREATE INDEX IF NOT EXISTS idx_actions_initiative_id ON actions(initiative_id);

COMMENT ON TABLE actions IS 'Concrete tasks linked to initiatives';

-- ================================================================
-- 6. CUSTOMERS (Phase 4 - Customer Success)
-- ================================================================

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  crm_id TEXT,
  name TEXT NOT NULL,
  mrr DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'churned', 'prospect')),
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_date TIMESTAMPTZ,
  first_event_date TIMESTAMPTZ,
  crm_integration_date TIMESTAMPTZ,
  last_qbr_date TIMESTAMPTZ,
  events_created INTEGER DEFAULT 0,
  total_attendees INTEGER DEFAULT 0,
  login_count INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ,
  csm_user_id UUID REFERENCES auth.users(id),
  activation_percent INTEGER DEFAULT 0 CHECK (activation_percent >= 0 AND activation_percent <= 100),
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  risk_score INTEGER,
  risk_reasons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_csm_user_id ON customers(csm_user_id);
CREATE INDEX idx_customers_health_score ON customers(health_score);

COMMENT ON TABLE customers IS 'Customer tracking for CS department';

-- ================================================================
-- 7. MANUAL METRICS (Phase 3 - KPI Tracking)
-- ================================================================

CREATE TABLE IF NOT EXISTS manual_metrics (
  id SERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_unit TEXT,
  target_value DECIMAL(10,2),
  initiative_id TEXT REFERENCES initiatives(id),
  department_id TEXT REFERENCES departments(id),
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  collected_by UUID REFERENCES auth.users(id),
  data_source TEXT DEFAULT 'manual' CHECK (data_source IN ('manual', 'api', 'imported')),
  notes TEXT
);

CREATE INDEX idx_manual_metrics_initiative_id ON manual_metrics(initiative_id);
CREATE INDEX idx_manual_metrics_department_id ON manual_metrics(department_id);
CREATE INDEX idx_manual_metrics_collected_at ON manual_metrics(collected_at);

COMMENT ON TABLE manual_metrics IS 'Manually tracked KPIs and metrics';

-- ================================================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE company_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_metrics ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

SELECT 'v3.0.0 Schema Migration Complete' AS status;