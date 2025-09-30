# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎯 PROJECT OVERVIEW

**Nevent Strategic Execution Platform** - Sistema de ejecución estratégica que conecta objetivos del CEO con el trabajo diario del equipo.

- **Type:** Single-page web application
- **Stack:** Vanilla JavaScript, HTML5, CSS3, Supabase
- **Current Version:** v2.1.0 (production), v3.0.0-alpha (development)
- **Repository:** https://github.com/franferrer12/Nevent-MKT-Roadmap
- **Production:** https://franferrer12.github.io/Nevent-MKT-Roadmap/

---

## 🚀 QUICK START

```bash
# Clone and start
git clone https://github.com/franferrer12/Nevent-MKT-Roadmap.git
cd Nevent-MKT-Roadmap

# Open with VS Code Live Server
# Right-click index.html → "Open with Live Server"

# Or use Python
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📁 PROJECT STRUCTURE

```
Nevent-MKT-Roadmap/
├── index.html              # Main application (1380 lines)
│   ├── CSS (lines 1-640)
│   ├── HTML (lines 640-790)
│   └── JavaScript (lines 795-1380)
│
├── /docs                   # Documentation
│   ├── README.md          # Documentation index
│   ├── architecture.md    # System architecture
│   ├── database.md        # Database schemas & queries
│   ├── api.md             # API reference
│   ├── development.md     # Development guide
│   └── deployment.md      # Deployment procedures
│
├── /migrations            # SQL migration scripts
│   ├── v3.0.0_schema.sql
│   └── v3.0.0_data.sql
│
├── CLAUDE.md             # This file
└── README.md             # GitHub readme
```

---

## 🏗️ ARCHITECTURE

### Single-File SPA Architecture

The entire application is contained in `index.html`:

1. **Styles (lines ~1-640):** CSS custom properties, responsive design
2. **Markup (lines ~640-790):** Login, main app, modals
3. **Logic (lines ~795-1380):** Supabase client, auth, CRUD, realtime

### Data Flow (v3.0.0)

```
Company OKRs (CEO)
    ↓
Department OKRs (Directors)
    ↓
User OKRs (Managers)
    ↓
Initiatives (Projects)
    ↓
Actions (Tasks)
    ↓
Manual Metrics (KPIs)
```

### Key Technologies

- **Frontend:** Vanilla JS (ES6+), no framework
- **Backend:** Supabase (PostgreSQL 15, Auth, Realtime)
- **Hosting:** GitHub Pages (auto-deploy on push to main)
- **Security:** Row Level Security (RLS) on all tables

---

## 🔑 CRITICAL INFORMATION

### Supabase Connection

```javascript
// Located in index.html ~line 795
const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Database Tables

**v2.1.0 (Production):**
- `roadmap_actions` - All tasks/projects
- `user_approvals` - User roles (admin/editor/viewer)
- `user_activity` - Activity log
- `notifications` - In-app notifications

**v3.0.0 (Development):**
- `company_okrs` - Annual company objectives
- `departments` - 7 active departments
- `user_okrs` - Individual OKRs
- `initiatives` - Strategic projects
- `actions` - Migrated from roadmap_actions
- `customers` - CS tracking (Phase 4)
- `manual_metrics` - KPI tracking (Phase 3)

---

## 💻 COMMON DEVELOPMENT TASKS

### Add New Feature

1. **Create feature branch:**
   ```bash
   git checkout -b feat/feature-name
   ```

2. **Edit index.html:**
   - Add HTML markup (lines 640-790)
   - Add CSS styles (lines 1-640)
   - Add JavaScript logic (lines 795-1380)

3. **Test locally** with Live Server

4. **Commit and push:**
   ```bash
   git add index.html
   git commit -m "feat: Add feature description"
   git push origin feat/feature-name
   ```

5. **Create Pull Request** on GitHub

### Modify Database Schema

1. **Create migration file:**
   ```bash
   touch migrations/v3.x.x_description.sql
   ```

2. **Write SQL:**
   ```sql
   -- migrations/v3.x.x_description.sql
   CREATE TABLE new_table (...);
   ALTER TABLE existing_table ADD COLUMN ...;
   ```

3. **Execute in Supabase Dashboard:**
   - SQL Editor → Run migration
   - Or use Supabase CLI

4. **Update RLS policies:**
   ```sql
   ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "policy_name" ON new_table ...;
   ```

### Add New Category

**Location:** `index.html` line ~730

```html
<select id="categorySelect">
  <option value="Marketing">📢 Marketing</option>
  <option value="New Category">🎯 New Category</option>
</select>
```

### Add New Quarter

**Location:** `index.html` line ~887

```javascript
roadmapData.quarters = {
  'Q4 2025': [],
  'Q1 2026': [],
  // ... existing quarters
  'Q1 2027': []  // NEW
};
```

Also update dropdown at line ~745.

---

## 🔍 CODE NAVIGATION

### Key Functions by Location

**Authentication (lines ~810-880):**
```javascript
async function handleLogin()      // Email/password login
async function checkSession()     // Validate session
async function handleLogout()     // Sign out
```

**Data Operations (lines ~900-980):**
```javascript
async function loadFromSupabase()          // Load all actions
async function saveToSupabase(action, q)   // Upsert action
async function deleteFromSupabase(id)      // Delete action
```

**UI Rendering (lines ~995-1110):**
```javascript
function renderTimeline()         // Render quarters/actions
function updateStats()            // Update stat cards
```

**CRUD Operations (lines ~1085-1150):**
```javascript
function openAddActionModal()     // Open create modal
function editAction(id, quarter)  // Open edit modal
async function saveAction()       // Save action
async function deleteAction()     // Delete action
```

**v3.0.0 Dashboard (lines ~1254-1370):**
```javascript
async function loadMyOKRs()        // Load user OKRs
async function loadMyInitiatives() // Load initiatives
function renderMyDashboard()       // Render dashboard
function toggleDashboardView()     // Switch views
```

---

## 📊 DATA MODELS

### Action Object

```javascript
{
  id: string,              // UUID
  quarter: string,         // "Q4 2025"
  category: string,        // "Marketing"
  title: string,
  description: string,
  priority: string,        // "Alta", "Media", "Baja"
  status: string,          // "Pendiente", "En curso", "Completado"
  responsable: string,     // User name
  deadline: string,        // "2025-11-30"
  subtasks: [{
    id: string,
    text: string,
    completed: boolean
  }],
  created_at: timestamp,
  updated_at: timestamp
}
```

### User OKR Object (v3.0.0)

```javascript
{
  id: string,
  user_id: string,
  title: string,
  contributes_to: string,  // Department OKR ID
  quarter: string,
  key_results: [{
    id: string,
    description: string,
    current: number,
    target: number,
    unit: string
  }],
  progress: number,        // 0-100, auto-calculated
  status: string,          // "on_track", "at_risk", "off_track"
  deadline: date
}
```

### Initiative Object (v3.0.0)

```javascript
{
  id: string,
  department_id: string,
  title: string,
  owner_id: string,
  contributes_to_okr: string,     // User OKR ID
  expected_impact: {
    okr_id: string,
    kr_id: string,
    expected_contribution: number  // %
  },
  quarter: string,
  start_date: date,
  end_date: date,
  status: string,                  // "not_started", "in_progress", "completed"
  progress: number,                // 0-100, auto-calculated from actions
  health: string,                  // "on_track", "at_risk", "off_track"
  budget_allocated: number,
  budget_spent: number,
  team_members: [string],
  blocked_by: [string]             // Initiative IDs
}
```

---

## 🐛 DEBUGGING

### Browser Console Commands

```javascript
// Check current user
console.log('User:', currentUser);
console.log('Role:', currentUserRole);

// Test Supabase connection
await supabase.from('roadmap_actions').select('count');

// Check realtime state
supabase.channel('roadmap_changes').state;  // Should be 'joined'

// View data
console.log('Data:', roadmapData);

// Force reload
await loadData();
renderTimeline();

// Clear cache
localStorage.clear();
location.reload();
```

### Common Issues

1. **Login fails:** Check user is approved in `user_approvals` table
2. **Changes don't save:** Verify user role (Viewer = read-only)
3. **Realtime not working:** Known issue v2.1.0, requires manual refresh
4. **"Failed to fetch":** Check Supabase status or network connection

---

## 🔒 SECURITY

### Row Level Security (RLS)

All tables have RLS enabled. Example:

```sql
-- Users can manage own OKRs
CREATE POLICY "Users can manage own OKRs"
ON user_okrs FOR ALL
USING (owner_id = auth.uid());

-- CEO can manage company OKRs
CREATE POLICY "CEO can manage company OKRs"
ON company_okrs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.role = 'ceo'
    AND user_approvals.approved = true
  )
);
```

### Permission Matrix

| Resource | CEO | Director | Manager | Executor |
|----------|-----|----------|---------|----------|
| Company OKRs | CRUD | R | R | - |
| Department OKRs | R | CRUD (own) | R | - |
| User OKRs | R | R (dept) | CRUD (own) | R |
| Initiatives | R | CRUD (dept) | CRUD (own) | R |
| Actions | R | R | CRUD | CRUD (assigned) |

---

## 🚀 DEPLOYMENT

### Automatic Deployment

```bash
# Any push to main auto-deploys to GitHub Pages
git push origin main
# Wait ~30 seconds
# Check: https://franferrer12.github.io/Nevent-MKT-Roadmap/
```

### Rollback

```bash
git revert HEAD
git push origin main
```

### Hotfix

```bash
git checkout main
git checkout -b hotfix/critical-bug
# Fix bug
git commit -am "hotfix: Fix critical bug"
git push origin hotfix/critical-bug
git checkout main
git merge hotfix/critical-bug
git push origin main
```

---

## 📈 ROADMAP

### v3.0.0 (In Development)

**✅ Completed:**
- Database schema (4 new tables)
- Migration from roadmap_actions → actions
- RLS policies
- Dashboard basic structure

**🚧 In Progress:**
- OKR creation modal
- Initiative creation modal
- Link actions to initiatives
- Auto-calculate progress/health

**⏳ Next:**
- Department dashboard (Director view)
- CEO dashboard (Executive view)
- Health indicators
- At-risk detection

---

## 📚 DOCUMENTATION

Comprehensive documentation available in `/docs`:

- `README.md` - Documentation index
- `architecture.md` - System architecture deep dive
- `database.md` - Database schemas, queries, RLS policies
- `api.md` - API reference and examples
- `development.md` - Development workflows and patterns
- `deployment.md` - Deployment and operations

---

## 📞 SUPPORT

```yaml
Developer: fran.ferrer@nevent.es
GitHub: @franferrer12
Issues: https://github.com/franferrer12/Nevent-MKT-Roadmap/issues

Supabase Dashboard: https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg
Supabase Status: https://status.supabase.com
```

---

## 🎯 DEVELOPMENT PRINCIPLES

1. **Keep it simple:** Single-file architecture is intentional
2. **No frameworks:** Vanilla JS for maintainability
3. **RLS first:** All security at database level
4. **Realtime everything:** WebSocket updates for all changes
5. **Mobile-first:** Responsive design from the start
6. **Document as you go:** Update docs with every feature

---

**Last Updated:** September 30, 2025
**Version:** 3.0.0-alpha
**Maintainer:** fran.ferrer@nevent.es