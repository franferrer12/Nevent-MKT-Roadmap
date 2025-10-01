-- ================================================================
-- QUICK PRODUCTION SETUP
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- ================================================================

-- 1. Insert 7 departments (name + color + icon) - skip if already exist
INSERT INTO public.departments (name, color, icon) VALUES
  ('Marketing', '#FF6B6B', '📢'),
  ('Sales', '#4ECDC4', '💰'),
  ('Product', '#95E1D3', '🎨'),
  ('Engineering', '#F38181', '⚙️'),
  ('Customer Success', '#AA96DA', '🤝'),
  ('Operations', '#FCBAD3', '🔧'),
  ('Finance', '#FFD93D', '💵')
ON CONFLICT (name) DO UPDATE SET
  color = EXCLUDED.color,
  icon = EXCLUDED.icon;

-- 2. Verify departments
SELECT id, name, color, icon FROM public.departments ORDER BY name;
