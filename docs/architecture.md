# 🏗️ Architecture

> System design, data flow, and technical decisions

---

## Overview

**Nevent Strategic Execution Platform** is a single-page web application built with vanilla JavaScript and Supabase backend.

### Design Philosophy

1. **Simplicity:** Single HTML file, no build process
2. **Real-time:** WebSocket updates for all changes
3. **Security-first:** RLS at database level
4. **Progressive:** v2.x tactical → v3.x strategic

---

## Tech Stack

```yaml
Frontend:
  - HTML5 (semantic markup)
  - CSS3 (custom properties, grid, flexbox)
  - JavaScript (Vanilla ES6+, no frameworks)

Backend:
  - Supabase (PostgreSQL 15, Auth, Realtime)
  - Row Level Security (RLS)
  - WebSockets for real-time sync

Hosting:
  - GitHub Pages (static files)
  - Auto-deploy on push to main

Tools:
  - Git (version control)
  - VS Code Live Server (development)
```

---

## System Architecture

### High-Level View

```
┌─────────────────────────────────────────┐
│         BROWSER (Client)                │
│  ┌───────────────────────────────────┐  │
│  │   index.html (Single File)        │  │
│  │   • CSS (styling)                 │  │
│  │   • HTML (structure)              │  │
│  │   • JavaScript (logic)            │  │
│  └──────────┬────────────────────────┘  │
└─────────────┼───────────────────────────┘
              │
              │ HTTPS + WebSocket
              ▼
┌─────────────────────────────────────────┐
│         SUPABASE (Backend)              │
│  ┌───────────────────────────────────┐  │
│  │   Auth Service                    │  │
│  │   • Email/Password                │  │
│  │   • JWT tokens                    │  │
│  │   • Session management            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   PostgreSQL 15                   │  │
│  │   • 8 tables                      │  │
│  │   • RLS policies                  │  │
│  │   • Triggers/functions            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Realtime (WebSockets)           │  │
│  │   • postgres_changes              │  │
│  │   • <100ms latency                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Data Hierarchy (v3.0.0)

```
Company OKRs (Annual, CEO-level)
    ↓ contributes_to
Departments (7 departments with budgets)
    ↓ part_of
User OKRs (Quarterly, Manager-level)
    ↓ achieves
Initiatives (Strategic projects)
    ↓ breaks_down_into
Actions (Concrete tasks)
    ↓ affects
Manual Metrics (KPIs tracked over time)
```

---

## Single-File Architecture

The entire app is in `index.html` (~1380 lines):

### 1. CSS Section (lines 1-640)

```css
:root {
  /* CSS custom properties */
  --bg: #0A0A0A;
  --accent1: #EC008C;
  /* ... */
}

/* Responsive grid layouts */
/* Dark theme styling */
/* Animation transitions */
```

### 2. HTML Section (lines 640-790)

```html
<!-- Login Page -->
<div id="loginPage">
  <!-- Login form -->
</div>

<!-- Main App -->
<div id="appPage">
  <!-- Header, stats, timeline -->
</div>

<!-- Modals -->
<div id="actionModal">
  <!-- CRUD forms -->
</div>
```

### 3. JavaScript Section (lines 795-1380)

```javascript
// Supabase client init
const supabase = createClient(URL, KEY);

// Auth functions
async function handleLogin() { ... }
async function checkSession() { ... }

// Data operations
async function loadFromSupabase() { ... }
async function saveToSupabase() { ... }

// UI rendering
function renderTimeline() { ... }
function updateStats() { ... }

// Realtime subscriptions
supabase.channel('roadmap_changes')
  .on('postgres_changes', ...)
  .subscribe();
```

---

## Authentication Flow

```
1. User enters email/password
   ↓
2. Supabase.auth.signInWithPassword()
   ↓
3. JWT token stored in localStorage
   ↓
4. Check user_approvals for role
   ↓
5. Load data based on RLS policies
   ↓
6. Show appropriate UI for role
```

---

## Data Flow: Create Action

```
1. User clicks "Nueva Acción"
   ↓
2. Modal opens (openAddActionModal)
   ↓
3. User fills form and clicks "Guardar"
   ↓
4. saveAction() validates data
   ↓
5. saveToSupabase() inserts to DB
   ↓
6. Supabase RLS checks permissions
   ↓
7. Insert succeeds → trigger realtime
   ↓
8. All connected clients receive update
   ↓
9. renderTimeline() shows new action
```

---

## Realtime Sync

```javascript
// Subscribe to changes
supabase
  .channel('roadmap_changes')
  .on('postgres_changes', {
    event: '*',  // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'roadmap_actions'
  }, payload => {
    console.log('Change detected:', payload);

    // Reload data
    loadData();

    // Re-render UI
    renderTimeline();
  })
  .subscribe();
```

**Benefits:**
- All users see changes instantly
- No polling required
- <100ms latency
- Automatic conflict resolution

---

## Security Architecture

### Row Level Security (RLS)

All tables have RLS enabled. Security is enforced at the database level, not in application code.

**Example policy:**

```sql
CREATE POLICY "Users can manage own OKRs"
ON user_okrs FOR ALL
USING (owner_id = auth.uid());
```

**How it works:**

1. User makes request with JWT
2. PostgreSQL validates JWT
3. Extracts `user_id` from token
4. Checks RLS policy with `auth.uid()`
5. Allows/denies query

**Benefits:**
- Can't be bypassed in code
- Single source of truth
- Automatically applies to all queries

---

## Scalability

### Current Limits (Supabase Free Tier)

```yaml
Storage: 500 MB (currently ~8 MB)
Bandwidth: 5 GB/month
Database size: 500 MB
Realtime connections: 200 concurrent
```

**Estimated capacity:**
- 50 users: ✅ No problem
- 500 actions/year: ✅ No problem
- Real-time for all: ✅ No problem

### Future Scaling

If limits exceeded:

```yaml
Option 1: Supabase Pro ($25/month)
  - 8 GB storage
  - 250 GB bandwidth
  - 5k concurrent connections

Option 2: Self-hosted PostgreSQL
  - AWS RDS or DigitalOcean
  - Full control
  - ~$50-100/month
```

---

## Performance

### Frontend

```yaml
Initial Load: ~500ms
Supabase Query: ~100-300ms
Realtime Latency: <100ms
Page Weight: ~40 KB (single HTML)
```

### Optimizations

1. **No framework overhead:** Vanilla JS = smaller bundle
2. **CSS custom properties:** Theme changes without JS
3. **Lazy render:** Only visible quarter rendered
4. **Efficient queries:** Select only needed columns
5. **Indexed columns:** quarter, status, responsable

---

## Design Decisions

### Why Single-File Architecture?

**Pros:**
- Zero build complexity
- Easy to understand
- Fast to load
- Simple deployment

**Cons:**
- Hard to scale beyond ~2000 lines
- No hot module reload
- Global scope pollution risk

**Decision:** For a 50-user app, pros outweigh cons.

### Why Vanilla JS (no React/Vue)?

**Pros:**
- No learning curve
- No dependencies to update
- Smaller bundle size
- Direct DOM manipulation

**Cons:**
- More verbose code
- Manual state management
- No component reusability

**Decision:** Simplicity > Features for this use case.

### Why Supabase (not custom backend)?

**Pros:**
- Auth out-of-the-box
- RLS native
- Realtime included
- Free tier generous
- Easy to migrate

**Cons:**
- Vendor lock-in risk
- Limited customization
- Query limitations

**Decision:** Faster development, good enough for now.

---

## Future Architecture (v4.0+)

Potential evolution:

```yaml
Consider if:
  - Users > 200
  - Actions > 10,000
  - Need mobile app
  - Complex workflows

Then migrate to:
  Frontend: React/Vue (component reusability)
  State: Redux/Vuex (better state management)
  Build: Vite/Webpack (code splitting)
  Backend: Keep Supabase or migrate to custom
  Mobile: React Native / Flutter
```

---

**Last Updated:** September 30, 2025
**Version:** 3.0.0-alpha