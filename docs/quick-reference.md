# ⚡ Quick Reference

> Common SQL queries, commands, and shortcuts

---

## 🔗 Quick Links

```yaml
Production: https://franferrer12.github.io/Nevent-MKT-Roadmap/
GitHub: https://github.com/franferrer12/Nevent-MKT-Roadmap
Supabase Dashboard: https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg
```

---

## 🗄️ Common SQL Queries

### Actions

```sql
-- All actions
SELECT * FROM roadmap_actions ORDER BY created_at DESC;

-- By quarter
SELECT quarter, COUNT(*) FROM roadmap_actions GROUP BY quarter;

-- Overdue
SELECT id, title, deadline, responsable
FROM roadmap_actions
WHERE deadline < CURRENT_DATE AND status != 'Completado';

-- By responsable
SELECT responsable, COUNT(*) as total,
       SUM(CASE WHEN status = 'Completado' THEN 1 ELSE 0 END) as completed
FROM roadmap_actions
WHERE responsable IS NOT NULL
GROUP BY responsable;
```

### Users

```sql
-- All users with roles
SELECT ua.email, ua.role, ua.approved, u.last_sign_in_at
FROM user_approvals ua
JOIN auth.users u ON ua.user_id = u.id
ORDER BY ua.created_at DESC;

-- Approve user
UPDATE user_approvals
SET approved = true, approved_at = NOW()
WHERE email = 'user@nevent.es';

-- Change role
UPDATE user_approvals
SET role = 'editor'
WHERE email = 'user@nevent.es';
```

### OKRs (v3.0.0)

```sql
-- User's OKRs with calculated progress
SELECT
  id, title, quarter,
  ROUND(AVG((kr->>'current')::numeric / (kr->>'target')::numeric * 100))::integer as progress
FROM user_okrs,
     jsonb_array_elements(key_results) as kr
WHERE user_id = 'USER_UUID'
GROUP BY id, title, quarter;

-- Department health
SELECT
  d.name,
  AVG(uo.progress)::integer as avg_progress,
  COUNT(uo.id) as okr_count
FROM departments d
LEFT JOIN user_okrs uo ON uo.contributes_to LIKE d.id || '%'
GROUP BY d.id, d.name;
```

---

## 💻 Browser Console Commands

```javascript
// Check user
console.log('User:', currentUser);
console.log('Role:', currentUserRole);

// Test Supabase
await supabase.from('roadmap_actions').select('count');

// Check realtime
supabase.channel('roadmap_changes').state;

// Force reload
await loadData();
renderTimeline();

// Clear cache
localStorage.clear();
location.reload();
```

---

## 🔧 Git Commands

```bash
# Feature branch
git checkout -b feat/new-feature
git add .
git commit -m "feat: Description"
git push origin feat/new-feature

# Hotfix
git checkout main
git checkout -b hotfix/bug
git commit -am "hotfix: Fix bug"
git checkout main
git merge hotfix/bug
git push origin main

# Rollback
git revert HEAD
git push origin main
```

---

## 🗄️ Maintenance

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('postgres'));

-- Table sizes
SELECT tablename,
       pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Cleanup
DELETE FROM notifications WHERE read = true AND created_at < NOW() - INTERVAL '30 days';
DELETE FROM user_activity WHERE timestamp < NOW() - INTERVAL '90 days';
VACUUM ANALYZE;
```

---

## 🚀 Deployment

```bash
# Deploy to production
git push origin main
# Wait ~30 seconds
# Verify: https://franferrer12.github.io/Nevent-MKT-Roadmap/
```

---

**Last Updated:** September 30, 2025