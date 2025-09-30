# 🔧 Troubleshooting Guide

> Complete guide for diagnosing and fixing common issues

---

## 🚨 Critical Issues (P0)

### App Completely Down

**Symptoms:**
- 404 error
- Blank page
- "Site can't be reached"

**Diagnosis:**
```bash
# 1. Check GitHub Pages status
curl -I https://franferrer12.github.io/Nevent-MKT-Roadmap/

# 2. Check Supabase status
curl -I https://tvbqzqripcevaryquhfg.supabase.co

# 3. Check GitHub Pages is enabled
# GitHub → Settings → Pages → Ensure "Source: main" is set
```

**Solutions:**
1. **If GitHub Pages is down:** Wait (rare) or deploy to Vercel backup
2. **If Supabase is down:** Check https://status.supabase.com
3. **If deployment failed:** Re-deploy by pushing empty commit
   ```bash
   git commit --allow-empty -m "trigger: Redeploy"
   git push origin main
   ```

---

## 🔐 Authentication Issues

### Cannot Login with Valid Credentials

**Symptoms:**
- "Invalid login credentials" error
- Correct email/password doesn't work

**Diagnosis:**
```javascript
// Open browser console (F12) and run:
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'your@email.com',
  password: 'yourpassword'
});

console.log('Data:', data);
console.log('Error:', error);
```

**Solutions:**

**1. Email not confirmed:**
```sql
-- Check in Supabase Dashboard
SELECT email, email_confirmed_at
FROM auth.users
WHERE email = 'user@nevent.es';

-- If email_confirmed_at is NULL:
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'user@nevent.es';
```

**2. Account not approved:**
```sql
SELECT approved FROM user_approvals
WHERE email = 'user@nevent.es';

-- If approved = false:
UPDATE user_approvals
SET approved = true, approved_at = NOW()
WHERE email = 'user@nevent.es';
```

**3. Wrong password:**
- Use "Forgot Password" flow
- Or reset in Supabase Dashboard → Authentication → Users

### Session Expires Immediately

**Symptoms:**
- Login works but immediately logged out
- Session doesn't persist

**Diagnosis:**
```javascript
// Check session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// Check localStorage
console.log('Token:', localStorage.getItem('supabase.auth.token'));
```

**Solutions:**

**1. Third-party cookies blocked:**
- Browser settings → Enable third-party cookies
- Or use incognito mode to test

**2. localStorage cleared:**
```javascript
// Check if localStorage works
try {
  localStorage.setItem('test', '1');
  console.log('localStorage works');
} catch (e) {
  console.error('localStorage blocked');
}
```

**3. JWT expired:**
- JWT expires after 1 hour by default
- Session should auto-refresh
- Check: Supabase Dashboard → Settings → API → JWT expiry

---

## 💾 Data Not Saving

### Changes Don't Persist

**Symptoms:**
- Create/edit action
- Changes disappear on reload

**Diagnosis:**
```javascript
// Test save manually
const { data, error } = await supabase
  .from('roadmap_actions')
  .insert({
    id: 'test_' + Date.now(),
    quarter: 'Q4 2025',
    category: 'Marketing',
    title: 'Test Action',
    status: 'Pendiente'
  });

console.log('Save result:', { data, error });
```

**Solutions:**

**1. RLS policy blocking:**
```sql
-- Check user role
SELECT role, approved FROM user_approvals
WHERE user_id = 'USER_UUID';

-- Viewer role can't edit
-- Solution: Change to editor
UPDATE user_approvals
SET role = 'editor'
WHERE user_id = 'USER_UUID';
```

**2. Missing required fields:**
```javascript
// Ensure all required fields present
const actionData = {
  id: generateId(),        // REQUIRED
  quarter: 'Q4 2025',      // REQUIRED
  category: 'Marketing',   // REQUIRED
  title: 'Action Title',   // REQUIRED
  status: 'Pendiente'      // REQUIRED
};
```

**3. Network error:**
```javascript
// Check network
navigator.onLine; // Should be true

// Test Supabase connection
fetch('https://tvbqzqripcevaryquhfg.supabase.co')
  .then(r => console.log('Supabase reachable'))
  .catch(e => console.error('Network error:', e));
```

### Subtasks Don't Save

**Symptoms:**
- Check subtask
- Doesn't persist

**Diagnosis:**
```javascript
// Check subtask structure
const action = roadmapData.quarters['Q4 2025']
  .find(a => a.id === 'ACTION_ID');

console.log('Subtasks:', action.subtasks);
// Should be array of {id, text, completed}
```

**Solutions:**

**1. Malformed subtasks:**
```javascript
// FIX: Ensure correct structure
action.subtasks = [
  {
    id: 'st_1',
    text: 'Subtask 1',
    completed: false
  }
];
```

**2. JSONB column issue:**
```sql
-- Check column type
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'roadmap_actions'
AND column_name = 'subtasks';

-- Should be: jsonb
-- If not, migrate:
ALTER TABLE roadmap_actions
ALTER COLUMN subtasks TYPE jsonb USING subtasks::jsonb;
```

---

## ⚡ Real-time Not Working

### Changes Don't Appear in Other Tabs

**Symptoms:**
- Edit in Tab A
- Doesn't show in Tab B

**Diagnosis:**
```javascript
// Check channel state
const state = supabase.channel('roadmap_changes').state;
console.log('Realtime state:', state);
// Should be: 'joined'
```

**Solutions:**

**1. Realtime not subscribed:**
```javascript
// Re-subscribe
supabase
  .channel('roadmap_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'roadmap_actions'
  }, (payload) => {
    console.log('Change:', payload);
    loadData();
    renderTimeline();
  })
  .subscribe();
```

**2. Firewall blocking WebSockets:**
```javascript
// Test WebSocket connection
const ws = new WebSocket('wss://tvbqzqripcevaryquhfg.supabase.co/realtime/v1/websocket');
ws.onopen = () => console.log('WebSocket works');
ws.onerror = (e) => console.error('WebSocket blocked:', e);
```

**3. Known issue in v2.1.0:**
- Workaround: Manual refresh every 5 minutes
- Fix: Implemented in v2.1.1 (pending)

---

## 📱 Mobile Issues

### UI Broken on Mobile

**Symptoms:**
- Layout broken
- Text overflows
- Buttons too small

**Diagnosis:**
```html
<!-- Check viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Solutions:**

**1. Missing viewport tag:**
- Already included in `index.html` line ~4
- If missing, add above

**2. CSS media queries:**
```css
/* Add mobile-specific styles */
@media (max-width: 768px) {
  .quarters-grid {
    grid-template-columns: 1fr; /* Stack vertically */
  }

  .action-card {
    font-size: 14px;
  }
}
```

### Keyboard Covers Input on Mobile

**Symptoms:**
- Keyboard opens
- Input field hidden behind keyboard

**Solutions:**

**1. Scroll into view:**
```javascript
document.getElementById('actionTitle').addEventListener('focus', function() {
  this.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
```

**2. Use vh units carefully:**
```css
/* Instead of 100vh */
min-height: 100vh;

/* Use */
min-height: calc(100vh - 100px);
```

---

## 🐌 Performance Issues

### App Loading Slowly

**Symptoms:**
- Takes >5 seconds to load
- Blank screen for long time

**Diagnosis:**
```javascript
// Measure load time
const start = Date.now();

await loadData();

const duration = Date.now() - start;
console.log(`Load time: ${duration}ms`);
// Should be <1000ms
```

**Solutions:**

**1. Too many actions:**
```javascript
// Paginate if >500 actions
const { data, error } = await supabase
  .from('roadmap_actions')
  .select('*')
  .range(0, 99)  // First 100
  .order('created_at', { ascending: false });
```

**2. Slow queries:**
```sql
-- Add indexes
CREATE INDEX idx_roadmap_actions_quarter ON roadmap_actions(quarter);
CREATE INDEX idx_roadmap_actions_status ON roadmap_actions(status);

-- Check slow queries
SELECT query, mean_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC;
```

**3. Network latency:**
```javascript
// Measure API latency
const start = Date.now();
await fetch('https://tvbqzqripcevaryquhfg.supabase.co');
console.log(`Latency: ${Date.now() - start}ms`);
// Should be <300ms
```

### UI Laggy When Scrolling

**Solutions:**

**1. Too many DOM nodes:**
```javascript
// Virtualize long lists (future)
// For now, limit visible actions
const ACTIONS_PER_PAGE = 20;
```

**2. Heavy animations:**
```css
/* Use transform instead of top/left */
.action-card {
  /* Bad */
  transition: top 0.3s;

  /* Good */
  transition: transform 0.3s;
}
```

---

## 🔍 Console Errors

### "Failed to fetch"

**Cause:** Network error or Supabase down

**Solutions:**
1. Check internet connection
2. Check Supabase status: https://status.supabase.com
3. Check CORS settings (Supabase Dashboard → API → URL Configuration)

### "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause:** CORS misconfigured

**Solution:**
```
Supabase Dashboard →
  Authentication →
  URL Configuration →
  Site URL: https://franferrer12.github.io
  Redirect URLs: https://franferrer12.github.io/**
```

### "Cannot read property 'X' of undefined"

**Cause:** Accessing property of null/undefined object

**Solution:**
```javascript
// Bad
const title = action.title.toUpperCase();

// Good
const title = action?.title?.toUpperCase() || '';
```

### "Maximum call stack size exceeded"

**Cause:** Infinite loop or recursion

**Solution:**
```javascript
// Check for circular calls
function loadData() {
  // Don't call loadData() again inside
}
```

---

## 🗄️ Database Issues

### Query Timeout

**Symptoms:**
- Query takes >60 seconds
- Supabase returns timeout error

**Solutions:**

**1. Optimize query:**
```sql
-- Bad: Full table scan
SELECT * FROM roadmap_actions WHERE title LIKE '%marketing%';

-- Good: Use indexes
SELECT * FROM roadmap_actions WHERE quarter = 'Q4 2025';
```

**2. Add indexes:**
```sql
CREATE INDEX idx_actions_search ON roadmap_actions USING gin(to_tsvector('english', title));
```

**3. Increase timeout (temp):**
```javascript
const { data, error } = await supabase
  .from('roadmap_actions')
  .select('*')
  .abortSignal(AbortSignal.timeout(120000)); // 2 minutes
```

### Connection Pool Exhausted

**Symptoms:**
- "remaining connection slots reserved for non-replication superuser connections"

**Solutions:**

**1. Enable connection pooling:**
```
Supabase Dashboard →
  Database →
  Connection Pooling →
  Enable Transaction Mode
```

**2. Close unused connections:**
```javascript
// Don't create multiple clients
// REUSE the same instance
const supabase = createClient(URL, KEY);
```

---

## 🔧 Development Issues

### Live Server Not Working

**Solutions:**

**Option A: Python:**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Option B: Node.js:**
```bash
npx http-server
```

**Option C: PHP:**
```bash
php -S localhost:8000
```

### Changes Not Reflecting

**Solutions:**

**1. Hard refresh:**
```
Ctrl+F5 (Windows/Linux)
Cmd+Shift+R (Mac)
```

**2. Clear cache:**
```
F12 → Network tab → Disable cache checkbox
```

**3. Incognito mode:**
- Open in incognito/private window
- No cache/extensions

---

## 📊 Health Check Script

Run this to diagnose multiple issues:

```javascript
async function healthCheck() {
  console.log('🏥 Starting Health Check...\n');

  // 1. Check internet
  if (!navigator.onLine) {
    console.error('❌ No internet connection');
    return;
  }
  console.log('✅ Internet connected');

  // 2. Check Supabase connection
  try {
    const response = await fetch('https://tvbqzqripcevaryquhfg.supabase.co');
    console.log('✅ Supabase reachable');
  } catch (e) {
    console.error('❌ Cannot reach Supabase:', e);
    return;
  }

  // 3. Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('❌ Not logged in');
    return;
  }
  console.log('✅ Authenticated:', session.user.email);

  // 4. Check user approval
  const { data: approval } = await supabase
    .from('user_approvals')
    .select('role, approved')
    .eq('user_id', session.user.id)
    .single();

  if (!approval?.approved) {
    console.error('❌ Account not approved');
    return;
  }
  console.log('✅ Account approved:', approval.role);

  // 5. Check data access
  const { data: actions, error } = await supabase
    .from('roadmap_actions')
    .select('count');

  if (error) {
    console.error('❌ Cannot access data:', error);
    return;
  }
  console.log('✅ Data accessible:', actions[0].count, 'actions');

  // 6. Check realtime
  const channel = supabase.channel('test');
  console.log('Realtime state:', channel.state);

  console.log('\n✅ All checks passed!');
}

// Run it
healthCheck();
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Check this guide** - Most issues covered here
2. **Search existing issues** - Maybe already reported
3. **Run health check** - Script above
4. **Collect information:**
   - Browser + version
   - Console errors (screenshot)
   - Steps to reproduce
   - Your role

### Where to Ask

- **Bug reports:** [GitHub Issues](https://github.com/franferrer12/Nevent-MKT-Roadmap/issues)
- **Questions:** [GitHub Discussions](https://github.com/franferrer12/Nevent-MKT-Roadmap/discussions)
- **Urgent:** Email fran.ferrer@nevent.es

---

**Last Updated:** September 30, 2025
**Version:** 3.0.0-alpha