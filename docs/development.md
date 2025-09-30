# 💻 Development Guide

> Setup, workflows, and coding standards

---

## Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/franferrer12/Nevent-MKT-Roadmap.git
cd Nevent-MKT-Roadmap

# 2. Open with VS Code
code .

# 3. Install Live Server extension
# Extensions → Search "Live Server" → Install

# 4. Start development server
# Right-click index.html → "Open with Live Server"
# Opens at http://localhost:5500
```

---

## Development Workflow

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feat/feature-name

# 2. Make changes in index.html
# Test locally with Live Server

# 3. Commit changes
git add index.html
git commit -m "feat: Add feature description"

# 4. Push to GitHub
git push origin feat/feature-name

# 5. Create Pull Request
# GitHub → New Pull Request → Merge to main

# 6. Auto-deploy to production
# GitHub Pages deploys automatically (~30s)
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Fix bug quickly

# 3. Commit and merge
git commit -am "hotfix: Fix critical bug"
git checkout main
git merge hotfix/critical-bug
git push origin main

# 4. Verify in production
# Check https://franferrer12.github.io/Nevent-MKT-Roadmap/
```

---

## Code Structure

### index.html Organization

```
Lines 1-640: CSS
  ├─ Custom properties (:root)
  ├─ Global styles
  ├─ Login page
  ├─ Main app
  ├─ Timeline/cards
  ├─ Modals
  └─ Responsive breakpoints

Lines 640-790: HTML
  ├─ Login page (#loginPage)
  ├─ Main app (#appPage)
  │   ├─ Header
  │   ├─ Stats cards
  │   └─ Timeline
  └─ Modals
      ├─ Action modal
      └─ User modal (admin)

Lines 795-1380: JavaScript
  ├─ Supabase init (795-800)
  ├─ Global state (800-810)
  ├─ Auth functions (810-880)
  ├─ Data operations (900-980)
  ├─ UI rendering (995-1110)
  ├─ CRUD operations (1085-1150)
  ├─ Notifications (1150-1200)
  ├─ User management (1200-1250)
  └─ v3.0 Dashboard (1254-1380)
```

---

## Coding Standards

### JavaScript

```javascript
// Use async/await, not .then()
async function loadData() {
  const { data, error } = await supabase
    .from('roadmap_actions')
    .select('*');

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Process data
}

// Use descriptive names
let currentUser = null;           // ✅ Good
let usr = null;                   // ❌ Bad

// Function names: verbNoun
async function loadActions() {}   // ✅ Good
async function actions() {}       // ❌ Bad

// Use const/let, never var
const MAX_RETRIES = 3;            // ✅ Good
var maxRetries = 3;               // ❌ Bad
```

### CSS

```css
/* Use CSS custom properties */
:root {
  --accent: #EC008C;
}

.button {
  background: var(--accent);      /* ✅ Good */
  background: #EC008C;            /* ❌ Bad */
}

/* BEM-like naming */
.action-card {}                   /* ✅ Good */
.actionCard {}                    /* ❌ Bad */

/* Mobile-first media queries */
.container {
  padding: 10px;                  /* Mobile default */
}

@media (min-width: 768px) {
  .container {
    padding: 20px;                /* Tablet+ */
  }
}
```

### HTML

```html
<!-- Semantic HTML -->
<header>...</header>              <!-- ✅ Good -->
<div class="header">...</div>     <!-- ❌ Bad -->

<!-- Accessibility -->
<button aria-label="Close">×</button>  <!-- ✅ Good -->
<div onclick="...">×</div>             <!-- ❌ Bad -->

<!-- IDs in camelCase, classes in kebab-case -->
<div id="actionModal" class="action-modal">  <!-- ✅ Good -->
<div id="action-modal" class="actionModal">  <!-- ❌ Bad -->
```

---

## Common Tasks

### Add New Category

**Location:** Line ~730

```html
<select id="categorySelect">
  <option value="Marketing">📢 Marketing</option>
  <option value="New Category">🎯 New Category</option>
</select>
```

### Add New Quarter

**Location:** Line ~887

```javascript
roadmapData.quarters = {
  'Q4 2025': [],
  'Q1 2026': [],
  // ... existing
  'Q1 2027': []  // NEW
};
```

Also update modal dropdown at ~line 745.

### Add Custom Field

**1. Database:**
```sql
ALTER TABLE roadmap_actions
ADD COLUMN new_field TEXT;
```

**2. Modal HTML (~line 760):**
```html
<div class="form-group">
  <label for="newField">New Field</label>
  <input type="text" id="newField">
</div>
```

**3. saveAction() (~line 1109):**
```javascript
const actionData = {
  // ... existing fields
  new_field: document.getElementById('newField').value
};
```

**4. Render in card (~line 1030):**
```javascript
${action.new_field ? `· ${action.new_field}` : ''}
```

### Add Database Function

**1. Create in Supabase SQL Editor:**
```sql
CREATE OR REPLACE FUNCTION my_function(param TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Logic here
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**2. Call from JavaScript:**
```javascript
const { data, error } = await supabase
  .rpc('my_function', { param: 'value' });
```

---

## Testing

### Manual Testing Checklist

```yaml
Before commit:
  - [ ] Login works
  - [ ] Create action works
  - [ ] Edit action works
  - [ ] Delete action works
  - [ ] Subtasks toggle works
  - [ ] Realtime sync works (test in 2 tabs)
  - [ ] No console errors
  - [ ] Mobile responsive (F12 → Device toolbar)

Before deploy:
  - [ ] All above tests pass
  - [ ] Test in Chrome, Firefox, Safari
  - [ ] Test on actual mobile device if possible
```

### Test Realtime

```javascript
// In two browser tabs:

// Tab 1: Create action
const { data } = await supabase
  .from('roadmap_actions')
  .insert({
    id: 'test_' + Date.now(),
    quarter: 'Q4 2025',
    category: 'Marketing',
    title: 'Test Realtime',
    status: 'Pendiente'
  });

// Tab 2: Should see new action appear within 1 second
```

### Debug Commands

```javascript
// In browser console (F12):

// Check user
console.log(currentUser);

// Check data
console.log(roadmapData);

// Test Supabase
await supabase.from('roadmap_actions').select('count');

// Force reload
await loadData();
renderTimeline();

// Clear cache
localStorage.clear();
location.reload();
```

---

## Environment Setup

### VS Code Extensions

```yaml
Required:
  - Live Server (ritwickdey.LiveServer)

Recommended:
  - ESLint (dbaeumer.vscode-eslint)
  - Prettier (esbenp.prettier-vscode)
  - HTML CSS Support (ecmel.vscode-html-css)
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "files.eol": "\n",
  "liveServer.settings.port": 5500
}
```

---

## Troubleshooting

### "Changes not visible"

```bash
# Hard refresh browser
Ctrl+F5  # Windows/Linux
Cmd+Shift+R  # Mac

# Or clear cache
# DevTools (F12) → Network → Disable cache
```

### "Supabase error"

```javascript
// Check connection
await fetch('https://tvbqzqripcevaryquhfg.supabase.co');

// Check status
// Visit https://status.supabase.com

// Check RLS policies
// Supabase Dashboard → Authentication → Policies
```

### "Live Server not working"

```bash
# Alternative: Python server
python -m http.server 8000

# Or Node.js
npx http-server
```

---

## Performance Tips

### Optimize Queries

```javascript
// BAD: Select all columns
const { data } = await supabase
  .from('roadmap_actions')
  .select('*');

// GOOD: Select only needed columns
const { data } = await supabase
  .from('roadmap_actions')
  .select('id, title, status, quarter');
```

### Debounce Realtime Updates

```javascript
let updateTimeout;

supabase.channel('changes')
  .on('postgres_changes', ..., () => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      loadData();
      renderTimeline();
    }, 500);  // Wait 500ms before updating
  });
```

---

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add OKR creation modal
fix: Fix login redirect loop
docs: Update README
style: Format code
refactor: Simplify renderTimeline
perf: Optimize database queries
test: Add manual test checklist
chore: Update dependencies
```

---

## Resources

- **Supabase Docs:** https://supabase.com/docs
- **MDN JavaScript:** https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Can I Use:** https://caniuse.com (browser compatibility)

---

**Last Updated:** September 30, 2025