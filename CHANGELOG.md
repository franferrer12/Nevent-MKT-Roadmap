# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🚧 In Progress (v3.0.0-beta)
- CEO Dashboard with company-wide OKR view
- Director Dashboard with department health metrics
- Company OKR creation (admin only)
- Department OKR management (directors)

### ✅ Completed Sprint (2025-09-30)

#### 🎯 User OKRs System
- **OKR Creation Modal** - Full-featured modal for creating personal OKRs
  - Dynamic key results (2-5 KRs per OKR)
  - Add/remove key results on the fly
  - Automatic progress calculation from KR metrics
  - Auto-determined status based on progress
  - Quarter and deadline selection
  - Integrated with dashboard

#### 🚀 Strategic Initiatives System
- **Initiative Creation Modal** - Project management interface
  - Link initiatives to User OKRs
  - Budget tracking (allocated vs spent)
  - Quarter and date range selection
  - Status management (not_started, in_progress, on_hold)
  - Health tracking (on_track, at_risk, off_track)

#### 🔗 Action → Initiative Linking
- Initiative dropdown in action creation/edit modal
- Real-time progress updates when actions change status
- Automatic health score calculation

#### 📊 Dashboard Visualization
- Progress bars with gradient animations
- Color-coded health/status badges with icons
- Key results display (first 3 with metrics)
- Budget tracking with spend percentage warnings
- Responsive card layouts

**Roadmap v3.0.0 Progress: 67% (4/6 features completed)**

---

## [3.0.0-alpha] - 2025-09-30

### Added
- 📊 **Database Schema v3.0:** New tables for hierarchical OKRs
  - `company_okrs` - Annual company objectives
  - `departments` - 7 active departments with budgets
  - `user_okrs` - Individual manager OKRs
  - `initiatives` - Strategic projects
  - `customers` - CS tracking (Phase 4)
  - `manual_metrics` - KPI tracking (Phase 3)
- 🏗️ **Migration Scripts:** `v3.0.0_schema.sql` and `v3.0.0_rls.sql`
- 📱 **Dashboard View:** "Mi Dashboard" with basic structure
- 🔄 **Toggle View:** Switch between Timeline and Dashboard
- 📚 **Comprehensive Documentation:**
  - Modular docs in `/docs` folder
  - `CLAUDE.md` optimized for AI assistance
  - `README.md` with badges and screenshots
  - API reference, architecture, database docs
- 🔐 **RLS Policies:** Row Level Security for all new tables

### Changed
- ⚠️ **BREAKING:** Renamed `roadmap_actions` → `actions`
- ⚠️ **BREAKING:** Actions now require `initiative_id` (optional for now)
- 🎨 **UI:** Added dashboard toggle button in header
- 📝 **Documentation:** Restructured from single file to modular

### Technical Debt
- Temporarily removed v2.1.0 features during v3.0 development:
  - Roles system (will be reintegrated)
  - Notifications (will be adapted to OKRs)
  - User management panel (will be adapted)

---

## [2.1.0] - 2025-09-29

### Added
- 👥 **User Management Panel:** Admins can approve users and change roles
- 🔔 **Notifications System:** In-app notifications for task assignments
- 📊 **Activity Log:** Track all user actions (create, edit, delete)
- 🎭 **Role-based Access:** Admin, Editor, Viewer roles with RLS
- 🔄 **Real-time Sync:** Live updates via WebSockets (partial)

### Changed
- 🔐 **Security:** All tables now have Row Level Security enabled
- 🎨 **UI:** Added role badges in header
- 📱 **Mobile:** Improved responsive design

### Fixed
- 🐛 Session persistence issues
- 🐛 Subtask toggle not saving
- 🐛 Modal z-index conflicts

---

## [2.0.0] - 2025-09-28

### Added
- 🔐 **Authentication:** Email/password login via Supabase Auth
- ✅ **CRUD Operations:** Create, read, update, delete actions
- 📅 **Timeline View:** Visual quarterly roadmap (Q4 2025 - Q4 2026)
- 🔄 **Real-time Sync:** Basic WebSocket implementation
- 🎯 **Subtasks:** Checkbox subtasks with auto-status update
- 📊 **Statistics:** 4 stat cards (total, completed, responsables, progress)
- 🗂️ **Categories:** Marketing, Contenido, Ventas, Producto, Operaciones
- 🎨 **Dark Theme:** Modern dark UI with pink/cyan accents

### Technical
- 📦 **Single-file Architecture:** Entire app in `index.html`
- 🗄️ **Database:** PostgreSQL 15 via Supabase
- 🔒 **Security:** JWT authentication, RLS policies
- 🌐 **Hosting:** GitHub Pages with auto-deploy

---

## [1.0.0] - 2025-09-27

### Added
- 📝 **Initial Release:** Basic roadmap visualization
- 🗂️ **Static Data:** Hardcoded quarterly actions
- 🎨 **Basic UI:** Simple timeline layout
- 📱 **Responsive:** Mobile-friendly design

---

## Version Legend

- 🎉 **Major:** Breaking changes, new architecture
- ✨ **Minor:** New features, backward compatible
- 🐛 **Patch:** Bug fixes, small improvements

## Categories

- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Vulnerability fixes

---

**Maintained by:** fran.ferrer@nevent.es
**Last Updated:** September 30, 2025