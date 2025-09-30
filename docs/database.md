# 🗄️ Database Reference

> Schemas, queries, RLS policies, and migrations

---

## Database Overview

- **Engine:** PostgreSQL 15
- **Host:** Supabase (tvbqzqripcevaryquhfg.supabase.co)
- **Region:** us-east-1
- **Size:** ~8 MB (current)
- **Backup:** Daily automatic (7-day retention)

---

## Tables

### v2.1.0 (Production)

1. `roadmap_actions` - All tasks/projects
2. `user_approvals` - User roles and permissions
3. `user_activity` - Activity log
4. `notifications` - In-app notifications

### v3.0.0 (Development)

5. `company_okrs` - Annual company objectives
6. `departments` - Department management
7. `user_okrs` - Individual OKRs
8. `initiatives` - Strategic projects
9. `actions` - Migrated from roadmap_actions
10. `customers` - Customer tracking (Phase 4)
11. `manual_metrics` - KPI tracking (Phase 3)

---

## Schema Definitions

### roadmap_actions (v2.1.0)

```sql
CREATE TABLE roadmap_actions (
  id TEXT PRIMARY KEY,
  quarter TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT,              -- 'Alta', 'Media', 'Baja'
  status TEXT,                -- 'Pendiente', 'En curso', 'Completado'
  responsable TEXT,
  deadline DATE,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roadmap_actions_quarter ON roadmap_actions(quarter);
CREATE INDEX idx_roadmap_actions_status ON roadmap_actions(status);
CREATE INDEX idx_roadmap_actions_responsable ON roadmap_actions(responsable);
```

### user_approvals

```sql
CREATE TABLE user_approvals (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  approved BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'viewer',  -- 'admin', 'editor', 'viewer'
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_approvals_user_id ON user_approvals(user_id);
CREATE INDEX idx_user_approvals_email ON user_approvals(email);
```

### user_okrs (v3.0.0)

```sql
CREATE TABLE user_okrs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  contributes_to TEXT,        -- Department OKR ID
  quarter TEXT NOT NULL,
  key_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'not_started',  -- 'not_started', 'on_track', 'at_risk', 'off_track', 'completed'
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_okrs_user_id ON user_okrs(user_id);
CREATE INDEX idx_user_okrs_quarter ON user_okrs(quarter);
CREATE INDEX idx_user_okrs_status ON user_okrs(status);
```

### initiatives (v3.0.0)

```sql
CREATE TABLE initiatives (
  id TEXT PRIMARY KEY,
  department_id TEXT REFERENCES departments(id),
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id),
  contributes_to_okr TEXT REFERENCES user_okrs(id),
  expected_impact JSONB,      -- { okr_id, kr_id, expected_contribution }
  quarter TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  health TEXT DEFAULT 'on_track',  -- 'on_track', 'at_risk', 'off_track'
  budget_allocated DECIMAL(10,2),
  budget_spent DECIMAL(10,2) DEFAULT 0,
  team_members UUID[],
  blocked_by TEXT[],
  blocks TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_initiatives_owner_id ON initiatives(owner_id);
CREATE INDEX idx_initiatives_department_id ON initiatives(department_id);
CREATE INDEX idx_initiatives_status ON initiatives(status);
```

### departments (v3.0.0)

```sql
CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  director_id UUID REFERENCES auth.users(id),
  budget JSONB,               -- { allocated, spent, currency }
  okrs JSONB DEFAULT '[]'::jsonb,
  health_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row Level Security (RLS)

### Enable RLS on All Tables

```sql
ALTER TABLE roadmap_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

#### roadmap_actions

```sql
-- Admins have full access
CREATE POLICY "Admins have full access"
ON roadmap_actions FOR ALL
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
ON roadmap_actions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role IN ('editor', 'admin')
    AND user_approvals.approved = true
  )
);

-- Viewers can read
CREATE POLICY "Viewers can read"
ON roadmap_actions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);
```

#### user_okrs

```sql
-- Users can read all OKRs
CREATE POLICY "Users can read all OKRs"
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
USING (owner_id = auth.uid());
```

#### initiatives

```sql
-- All can read
CREATE POLICY "All can read initiatives"
ON initiatives FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.approved = true
  )
);

-- Owners can manage
CREATE POLICY "Owners can manage initiatives"
ON initiatives FOR ALL
USING (owner_id = auth.uid());

-- Team members can update
CREATE POLICY "Team members can update"
ON initiatives FOR UPDATE
USING (auth.uid() = ANY(team_members));
```

---

## Common Queries

### Get All Actions

```sql
SELECT * FROM roadmap_actions
ORDER BY created_at DESC;
```

### Actions by Quarter

```sql
SELECT quarter, COUNT(*) as total
FROM roadmap_actions
GROUP BY quarter
ORDER BY quarter;
```

### Overdue Actions

```sql
SELECT id, title, deadline, responsable
FROM roadmap_actions
WHERE deadline < CURRENT_DATE
AND status != 'Completado'
ORDER BY deadline;
```

### User's OKRs with Progress

```sql
SELECT
  id,
  title,
  quarter,
  progress,
  status,
  ROUND(
    (SELECT AVG((kr->>'current')::numeric / (kr->>'target')::numeric * 100)
     FROM jsonb_array_elements(key_results) AS kr
    )::numeric, 2
  ) AS calculated_progress
FROM user_okrs
WHERE user_id = 'USER_UUID'
ORDER BY created_at DESC;
```

### Initiatives with Health

```sql
SELECT
  i.id,
  i.title,
  i.status,
  i.progress,
  i.health,
  i.budget_allocated,
  i.budget_spent,
  ROUND((i.budget_spent / NULLIF(i.budget_allocated, 0) * 100)::numeric, 2) AS budget_used_percent,
  u.email AS owner_email
FROM initiatives i
LEFT JOIN auth.users u ON i.owner_id = u.id
WHERE i.status != 'completed'
ORDER BY i.health DESC;
```

### Department Health Scores

```sql
SELECT
  d.name,
  d.health_score,
  COUNT(uo.id) AS okr_count,
  ROUND(AVG(uo.progress)::numeric, 2) AS avg_okr_progress
FROM departments d
LEFT JOIN user_okrs uo ON uo.contributes_to LIKE d.id || '%'
GROUP BY d.id, d.name, d.health_score
ORDER BY d.health_score DESC;
```

---

## Database Functions

### Calculate OKR Progress

```sql
CREATE OR REPLACE FUNCTION calculate_okr_progress(okr_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  avg_progress INTEGER;
BEGIN
  SELECT ROUND(AVG(
    (kr->>'current')::DECIMAL / NULLIF((kr->>'target')::DECIMAL, 0) * 100
  ))::INTEGER
  INTO avg_progress
  FROM user_okrs,
       jsonb_array_elements(key_results) AS kr
  WHERE id = okr_id;

  RETURN COALESCE(avg_progress, 0);
END;
$$ LANGUAGE plpgsql;
```

### Update Initiative Progress

```sql
CREATE OR REPLACE FUNCTION update_initiative_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate progress from linked actions
  UPDATE initiatives
  SET
    progress = (
      SELECT ROUND(AVG(
        CASE
          WHEN status = 'Completado' THEN 100
          WHEN status = 'En curso' THEN 50
          ELSE 0
        END
      ))::INTEGER
      FROM actions
      WHERE initiative_id = NEW.initiative_id
    ),
    health = CASE
      WHEN (SELECT AVG(...) FROM actions WHERE initiative_id = NEW.initiative_id) >= 70 THEN 'on_track'
      WHEN (SELECT AVG(...) FROM actions WHERE initiative_id = NEW.initiative_id) >= 40 THEN 'at_risk'
      ELSE 'off_track'
    END
  WHERE id = NEW.initiative_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_initiative_progress_trigger
AFTER INSERT OR UPDATE ON actions
FOR EACH ROW
EXECUTE FUNCTION update_initiative_progress();
```

---

## Maintenance Queries

### Database Size

```sql
SELECT pg_size_pretty(pg_database_size('postgres')) AS total_size;
```

### Table Sizes

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_live_tup AS row_count
FROM pg_tables
LEFT JOIN pg_stat_user_tables USING (schemaname, tablename)
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Unused Indexes

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Cleanup Old Data

```sql
-- Delete old read notifications (>30 days)
DELETE FROM notifications
WHERE read = true
AND created_at < NOW() - INTERVAL '30 days';

-- Delete old activity logs (>90 days)
DELETE FROM user_activity
WHERE timestamp < NOW() - INTERVAL '90 days';

-- Vacuum
VACUUM ANALYZE roadmap_actions;
VACUUM ANALYZE notifications;
VACUUM ANALYZE user_activity;
```

---

## Backup & Restore

### Manual Backup

```bash
pg_dump -h db.tvbqzqripcevaryquhfg.supabase.co \
        -U postgres \
        -d postgres \
        -f backup_$(date +%Y%m%d).sql
```

### Backup Specific Tables

```bash
pg_dump -h db.tvbqzqripcevaryquhfg.supabase.co \
        -U postgres \
        -d postgres \
        -t roadmap_actions \
        -t user_okrs \
        -t initiatives \
        -f backup_tables_$(date +%Y%m%d).sql
```

### Restore

```bash
psql -h db.tvbqzqripcevaryquhfg.supabase.co \
     -U postgres \
     -d postgres \
     -f backup_20250930.sql
```

---

## Migration Scripts

See `/migrations` directory for:

- `v3.0.0_schema.sql` - Create new tables
- `v3.0.0_data.sql` - Migrate existing data
- `v3.0.0_rls.sql` - RLS policies

---

**Last Updated:** September 30, 2025
**Version:** 3.0.0-alpha