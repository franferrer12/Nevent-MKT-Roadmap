# 🚀 Production Deployment Guide

**Target**: GitHub Pages
**Version**: v3.1.0 (Latest)
**Status**: ✅ Production Ready
**Last Deploy**: October 1, 2025

---

## ⚡ Quick Deploy (For v3.1.0+)

```bash
# 1. Pull latest code
git pull origin main
git checkout v3.1.0

# 2. Apply required migrations in Supabase SQL Editor
# - migrations/ADD_DEPARTMENTS_STATUS.sql
# - migrations/FIX_COMPANY_OKRS_RLS.sql
# - Insert Company OKRs (see RELEASE_NOTES_v3.1.0.md)

# 3. Deploy (GitHub Pages auto-deploys from main branch)
# Already deployed at: https://franferrer12.github.io/Nevent-MKT-Roadmap/

# 4. Verify production
# Login with: ceo@nevent.es / Test1234!
```

## 🆕 v3.1.0 Hotfix Migrations

If upgrading from v3.0.0, execute these in Supabase:

### 1. Add Departments Status Column
```sql
-- migrations/ADD_DEPARTMENTS_STATUS.sql
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
CHECK (status IN ('active', 'inactive'));

UPDATE public.departments
SET status = 'active'
WHERE status IS NULL;
```

### 2. Fix Company OKRs RLS Policies
```sql
-- migrations/FIX_COMPANY_OKRS_RLS.sql
DROP POLICY IF EXISTS "CEO can manage company OKRs" ON company_okrs;
DROP POLICY IF EXISTS "All can read company OKRs" ON company_okrs;

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
```

### 3. Insert Company OKRs (if empty)
```sql
-- Check if empty
SELECT COUNT(*) FROM company_okrs;

-- If 0, insert seed data (see v3.0.0_seed_data.sql lines 26-123)
INSERT INTO company_okrs (id, fiscal_year, objective, key_results, health_score)
VALUES (...);  -- See full SQL in migrations/v3.0.0_seed_data.sql
```

---

## 📋 Full Deployment Checklist

### **Step 1: Database Setup (30 min)** ⚠️ CRITICAL

1. **Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg
   ```

2. **Run Production SQL**
   - Click: **SQL Editor** → **New Query**
   - Open file: `migrations/PRODUCTION_SETUP.sql`
   - Copy ALL content (Ctrl+A, Ctrl+C)
   - Paste in Supabase editor
   - Click **RUN** ▶️
   - Wait for success message (~10 seconds)

3. **Verify Tables Created**
   Run this query:
   ```sql
   SELECT
     'users' as table_name, COUNT(*) FROM public.users
   UNION ALL
   SELECT 'departments', COUNT(*) FROM public.departments
   UNION ALL
   SELECT 'customers', COUNT(*) FROM public.customers;
   ```

   Expected:
   - users: 0 rows
   - departments: 7 rows
   - customers: 0 rows

4. **Create Test Users**
   - Click: **Authentication** → **Users** → **Add User**
   - Create 4 users (one by one):

   | Email | Password | Auto Confirm |
   |-------|----------|--------------|
   | ceo@nevent.es | Test1234! | ✅ YES |
   | director@nevent.es | Test1234! | ✅ YES |
   | csm@nevent.es | Test1234! | ✅ YES |
   | user@nevent.es | Test1234! | ✅ YES |

   ⚠️ **CRITICAL**: Check "Auto Confirm User" for each!

5. **Verify Trigger Worked**
   Run this query:
   ```sql
   SELECT id, email, role, full_name
   FROM public.users
   WHERE email LIKE '%@nevent.es'
   ORDER BY email;
   ```

   Expected: 4 rows with correct roles:
   - ceo@nevent.es → role='ceo'
   - csm@nevent.es → role='csm'
   - director@nevent.es → role='director'
   - user@nevent.es → role='user'

6. **Run Verification Script**
   ```bash
   node setup-production.mjs
   ```

   Expected output:
   ```
   ✓ Tables:      7/7 (100%)
   ✓ Test Users:  4/4
   ✓ Departments: 7
   ✅ PRODUCTION READY
   ```

---

### **Step 2: Local Testing (15 min)**

Test in local environment (http://127.0.0.1:8080):

#### Test CEO User:
```
Email: ceo@nevent.es
Password: Test1234!
```
- [x] Login successful
- [x] See CEO Dashboard
- [x] View As dropdown appears
- [x] Can switch to other users
- [x] Banner + overlay appear
- [x] Can create Company OKR
- [x] Department Health Grid shows 7 depts

#### Test Director User:
```
Email: director@nevent.es
Password: Test1234!
```
- [x] Login successful
- [x] See Director Dashboard
- [x] No View As feature
- [x] Department metrics load
- [x] Team member grid works

#### Test CSM User:
```
Email: csm@nevent.es
Password: Test1234!
```
- [x] Login successful
- [x] See CS Dashboard
- [x] Can create customers
- [x] Health score calculates
- [x] NRR & Churn show correctly

#### Test Regular User:
```
Email: user@nevent.es
Password: Test1234!
```
- [x] Login successful
- [x] Only see User Dashboard
- [x] Can create User OKRs
- [x] Can create Initiatives

#### Analytics Check:
- [x] Open DevTools → Console
- [x] See "📊 Analytics: user_login" on login
- [x] See tracking events on actions
- [x] Run: `analytics.getEvents()` → Returns array

---

### **Step 3: Pre-Deploy Checks**

```bash
# Run automated tests
node tests/automated-tests.mjs

# Expected: Pass Rate ≥ 90%
```

#### Code Quality:
- [x] No console.errors in DevTools
- [x] No 404s in Network tab
- [x] index.html < 500KB
- [x] No hardcoded secrets (only anon key)
- [x] 404.html exists
- [x] progress-dashboard.html accessible

#### Documentation:
- [x] README.md up to date
- [x] CHANGELOG.md complete
- [x] TEST_USERS.md exists
- [x] PRE_PRODUCTION_CHECKLIST.md exists

---

### **Step 4: Deploy to GitHub Pages**

```bash
# 1. Commit everything
git add .
git status  # Review changes

git commit -m "chore(deploy): production setup complete - ready for v3.0.0"

# 2. Create release tag
git tag -a v3.0.0 -m "Release v3.0.0 - Strategic Execution Platform

Features:
- User OKRs with dynamic KRs
- CEO Dashboard with Company OKRs
- Director Dashboard with team management
- Customer Success Dashboard with NRR/Churn
- View As system for CEO
- UX Sprint 1: Confirmations, Analytics, Enhanced UI
- Complete testing infrastructure
- €0/month operational cost

Tested with 4 roles, 26 automated tests, manual validation complete."

# 3. Push to GitHub
git push origin main --tags

# 4. Verify GitHub Pages is enabled
# Go to: https://github.com/franferrer12/Nevent-MKT-Roadmap/settings/pages
# Ensure: Source = "Deploy from branch main / (root)"
```

---

### **Step 5: Post-Deploy Verification (10 min)**

Wait 2-3 minutes for GitHub Pages build, then:

1. **Access Production URL**
   ```
   https://franferrer12.github.io/Nevent-MKT-Roadmap/
   ```

2. **Smoke Tests in Production**
   - [x] Login page loads (no errors)
   - [x] Login with ceo@nevent.es works
   - [x] Supabase connection works (no CORS errors)
   - [x] Dashboard loads correctly
   - [x] Can create a test customer
   - [x] Analytics tracking works (check localStorage)
   - [x] Logout and re-login works

3. **Mobile Testing**
   - [x] Open in mobile browser
   - [x] Responsive design works
   - [x] Touch interactions work
   - [x] Modals fit on screen

4. **Browser Compatibility**
   - [x] Chrome/Edge (Chromium)
   - [x] Firefox
   - [x] Safari (if available)

---

### **Step 6: Monitoring Setup**

#### Bookmark These URLs:
```
Production App:
https://franferrer12.github.io/Nevent-MKT-Roadmap/

Progress Dashboard:
https://franferrer12.github.io/Nevent-MKT-Roadmap/progress-dashboard.html

Supabase Dashboard:
https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg

GitHub Repo:
https://github.com/franferrer12/Nevent-MKT-Roadmap
```

#### Setup Monitoring:
- [x] Add Supabase project to favorites
- [x] Enable email notifications (GitHub repo)
- [x] Bookmark Supabase usage metrics
- [x] Set calendar reminder for Free Tier check (monthly)

---

## 🚨 Troubleshooting

### Issue: "Table does not exist" errors
**Solution**: Run `migrations/PRODUCTION_SETUP.sql` in Supabase

### Issue: Test users can't login
**Solution**:
1. Check email is confirmed in Auth → Users
2. Verify user exists in public.users table
3. Re-create user with "Auto Confirm" checked

### Issue: "Permission denied" on data access
**Solution**:
1. Check RLS policies in Supabase
2. Verify user has correct role in public.users
3. Re-run PRODUCTION_SETUP.sql to restore policies

### Issue: GitHub Pages not updating
**Solution**:
1. Check Actions tab for build status
2. Wait 5 minutes (can take time)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check Settings → Pages is enabled

### Issue: Supabase connection fails in production
**Solution**:
1. Verify SUPABASE_URL and KEY are correct in index.html
2. Check CORS settings (should be default)
3. Verify Supabase project is not paused

---

## 📊 Success Criteria

Deployment is successful when:

- ✅ All 7 database tables exist
- ✅ 4 test users can login
- ✅ All 4 roles work correctly (user/director/ceo/csm)
- ✅ Automated tests pass ≥ 90%
- ✅ Production URL is accessible
- ✅ No console errors in production
- ✅ All CRUD operations work
- ✅ Analytics tracking works
- ✅ Mobile responsive works

---

## 🎉 Post-Deployment

### Share with Team:
```
🚀 Nevent Strategic Execution Platform v3.0.0 is LIVE!

Production URL:
https://franferrer12.github.io/Nevent-MKT-Roadmap/

Test Credentials:
- CEO: ceo@nevent.es / Test1234!
- Director: director@nevent.es / Test1234!
- CSM: csm@nevent.es / Test1234!
- User: user@nevent.es / Test1234!

Features:
✅ OKR Management (Company, Department, User)
✅ Strategic Initiatives with budget tracking
✅ Customer Success Dashboard with NRR/Churn
✅ Multi-dashboard system (CEO, Director, CS, User)
✅ View As system for CEO role
✅ Real-time analytics tracking
✅ €0/month operational cost

Documentation:
- Progress: https://[url]/progress-dashboard.html
- Changelog: See CHANGELOG.md
```

### Next Steps:
1. **Collect user feedback** (first week)
2. **Monitor Supabase usage** (daily for first week)
3. **Plan Sprint 2 UX** (loading states, tooltips, keyboard nav)
4. **Consider integrations** (Stripe, Pipedrive, Calendar)

---

## 📝 Rollback Plan

If critical issues arise:

```bash
# 1. Revert to previous version
git revert HEAD
git push origin main

# 2. Or rollback to specific commit
git reset --hard <previous-commit-hash>
git push origin main --force

# 3. Database rollback (if needed)
# Restore from Supabase backup or re-run migrations
```

---

**Deployment Checklist Last Updated**: 2025-09-30
**Version**: 1.0
**Maintained by**: fran.ferrer@nevent.es

🚀 **Good luck with the deployment!**