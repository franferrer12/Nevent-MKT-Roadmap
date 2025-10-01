-- ================================================================
-- CAMPAIGNS MODULE - Database Schema v3.4.0
-- ================================================================
-- Created: October 1, 2025
-- Purpose: Campaign Management for Marketing Hub

-- ================================================================
-- TABLE: campaigns
-- ================================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY DEFAULT ('campaign_' || gen_random_uuid()::text),
  name TEXT NOT NULL,
  description TEXT,
  budget_allocated DECIMAL(10,2) DEFAULT 0,
  budget_spent DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planning', -- 'planning', 'active', 'paused', 'completed', 'cancelled'
  roi DECIMAL(10,2) DEFAULT 0,
  department_id INTEGER REFERENCES departments(id),
  owner_id UUID REFERENCES auth.users(id),
  okr_id TEXT REFERENCES company_okrs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
  CONSTRAINT valid_budget CHECK (budget_allocated >= 0 AND budget_spent >= 0),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- ================================================================
-- TABLE: campaign_team
-- ================================================================
CREATE TABLE IF NOT EXISTS campaign_team (
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'member', 'reviewer'
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  PRIMARY KEY (campaign_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'member', 'reviewer'))
);

-- ================================================================
-- TABLE: campaign_activities
-- ================================================================
CREATE TABLE IF NOT EXISTS campaign_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'budget_update', 'status_change', 'team_change', 'comment'
  description TEXT,
  old_value TEXT,
  new_value TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_department ON campaigns(department_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaign_team_user ON campaign_team(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign ON campaign_activities(campaign_id);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Enable read access for all authenticated users"
ON campaigns FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON campaigns FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for campaign owners and team members"
ON campaigns FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid() OR
  id IN (SELECT campaign_id FROM campaign_team WHERE user_id = auth.uid())
);

CREATE POLICY "Enable delete for campaign owners"
ON campaigns FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Campaign team policies
CREATE POLICY "Enable read access for all authenticated users"
ON campaign_team FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for campaign owners"
ON campaign_team FOR INSERT
TO authenticated
WITH CHECK (
  campaign_id IN (SELECT id FROM campaigns WHERE owner_id = auth.uid())
);

CREATE POLICY "Enable delete for campaign owners"
ON campaign_team FOR DELETE
TO authenticated
USING (
  campaign_id IN (SELECT id FROM campaigns WHERE owner_id = auth.uid())
);

-- Campaign activities policies
CREATE POLICY "Enable read access for all authenticated users"
ON campaign_activities FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON campaign_activities FOR INSERT
TO authenticated
WITH CHECK (true);

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Update updated_at timestamp on campaigns
CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaigns_updated_at
BEFORE UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION update_campaigns_updated_at();

-- Auto-calculate ROI when budget changes
CREATE OR REPLACE FUNCTION calculate_campaign_roi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.budget_spent > 0 AND NEW.budget_allocated > 0 THEN
    -- Simplified ROI = ((Revenue - Cost) / Cost) * 100
    -- For now, we'll use a placeholder formula
    -- In production, you'd link to revenue data
    NEW.roi = ((NEW.budget_allocated - NEW.budget_spent) / NEW.budget_spent) * 100;
  ELSE
    NEW.roi = 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_campaign_roi
BEFORE INSERT OR UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION calculate_campaign_roi();

-- ================================================================
-- SEED DATA (Sample campaigns for testing)
-- ================================================================
INSERT INTO campaigns (id, name, description, budget_allocated, budget_spent, start_date, end_date, status, department_id, owner_id)
VALUES
  (
    'campaign_q1_content',
    'Q1 Content Marketing',
    'Estrategia de contenido para aumentar brand awareness',
    10000,
    8500,
    '2026-01-01',
    '2026-03-31',
    'active',
    NULL,
    NULL
  ),
  (
    'campaign_ppc_google',
    'Google Ads - Lead Generation',
    'Campaña PPC para generación de leads cualificados',
    15000,
    12000,
    '2026-01-15',
    '2026-04-15',
    'active',
    NULL,
    NULL
  ),
  (
    'campaign_social_media',
    'Social Media Engagement',
    'Aumentar engagement en RRSS (LinkedIn, Twitter)',
    5000,
    2500,
    '2026-02-01',
    '2026-05-01',
    'planning',
    NULL,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
-- Uncomment to test after creation:
-- SELECT * FROM campaigns;
-- SELECT * FROM campaign_team;
-- SELECT * FROM campaign_activities;
