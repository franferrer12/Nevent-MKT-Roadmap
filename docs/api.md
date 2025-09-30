# 🔌 API Reference

> Complete Supabase API reference with examples and best practices

---

## Overview

This application uses Supabase client library for all backend operations. All data access goes through Row Level Security (RLS) policies.

**Base Configuration:**
```javascript
const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## Authentication API

### Login

```javascript
async function handleLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Login failed:', error.message);
    return null;
  }

  return data.user;
}

// Usage
const user = await handleLogin('user@nevent.es', 'password123');
```

### Get Current Session

```javascript
async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Session check failed:', error);
    return null;
  }

  return session;
}
```

### Logout

```javascript
async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error);
  }

  localStorage.clear();
  location.reload();
}
```

### Password Reset

```javascript
async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://franferrer12.github.io/Nevent-MKT-Roadmap/'
  });

  if (error) {
    console.error('Reset failed:', error);
    return false;
  }

  return true;
}
```

---

## Data Operations API

### Select (Read)

```javascript
// Get all actions
const { data, error } = await supabase
  .from('roadmap_actions')
  .select('*')
  .order('created_at', { ascending: false });

// Get with filters
const { data, error } = await supabase
  .from('roadmap_actions')
  .select('*')
  .eq('quarter', 'Q4 2025')
  .eq('status', 'Completado');

// Get specific columns
const { data, error } = await supabase
  .from('roadmap_actions')
  .select('id, title, status, deadline')
  .limit(10);

// Get with joins (foreign keys)
const { data, error } = await supabase
  .from('initiatives')
  .select(`
    *,
    owner:auth.users!owner_id(email),
    actions!initiative_id(id, title, status)
  `);

// Count
const { count, error } = await supabase
  .from('roadmap_actions')
  .select('*', { count: 'exact', head: true });
```

### Insert (Create)

```javascript
// Single insert
const { data, error } = await supabase
  .from('roadmap_actions')
  .insert({
    id: generateId(),
    quarter: 'Q4 2025',
    category: 'Marketing',
    title: 'Nueva campaña',
    status: 'Pendiente',
    created_at: new Date().toISOString()
  })
  .select();  // Return inserted row

// Batch insert
const { data, error } = await supabase
  .from('roadmap_actions')
  .insert([
    { id: 'id1', title: 'Action 1', ... },
    { id: 'id2', title: 'Action 2', ... }
  ])
  .select();
```

### Update

```javascript
// Update by ID
const { data, error } = await supabase
  .from('roadmap_actions')
  .update({
    status: 'Completado',
    updated_at: new Date().toISOString()
  })
  .eq('id', actionId)
  .select();

// Update multiple rows
const { data, error } = await supabase
  .from('roadmap_actions')
  .update({ priority: 'Alta' })
  .eq('quarter', 'Q4 2025')
  .eq('status', 'Pendiente');

// Upsert (insert or update)
const { data, error } = await supabase
  .from('roadmap_actions')
  .upsert({
    id: actionId,  // If exists: update, else: insert
    title: 'Updated Title',
    status: 'En curso'
  })
  .select();
```

### Delete

```javascript
// Delete by ID
const { error } = await supabase
  .from('roadmap_actions')
  .delete()
  .eq('id', actionId);

// Delete with conditions
const { error } = await supabase
  .from('roadmap_actions')
  .delete()
  .eq('status', 'Completado')
  .lt('updated_at', '2024-01-01');
```

---

## Realtime API

### Subscribe to Changes

```javascript
// Subscribe to all changes
const channel = supabase
  .channel('roadmap_changes')
  .on('postgres_changes', {
    event: '*',  // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'roadmap_actions'
  }, (payload) => {
    console.log('Change detected:', payload);

    switch(payload.eventType) {
      case 'INSERT':
        // Handle new action
        addActionToUI(payload.new);
        break;
      case 'UPDATE':
        // Handle update
        updateActionInUI(payload.new);
        break;
      case 'DELETE':
        // Handle delete
        removeActionFromUI(payload.old.id);
        break;
    }
  })
  .subscribe();

// Unsubscribe
channel.unsubscribe();

// Subscribe to specific events only
supabase
  .channel('only_inserts')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'roadmap_actions'
  }, handleNewAction)
  .subscribe();

// Subscribe with filters
supabase
  .channel('q4_actions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'roadmap_actions',
    filter: 'quarter=eq.Q4 2025'
  }, handleChange)
  .subscribe();
```

### Presence (Online Users)

```javascript
// Track online users
const channel = supabase.channel('online_users', {
  config: {
    presence: {
      key: currentUser.id
    }
  }
});

// Send presence data
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  console.log('Online users:', Object.keys(state).length);
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      user_id: currentUser.id,
      email: currentUser.email,
      online_at: new Date().toISOString()
    });
  }
});
```

---

## RPC (Remote Procedure Calls)

### Call Database Functions

```javascript
// Simple function call
const { data, error } = await supabase
  .rpc('calculate_okr_progress', {
    okr_id: 'okr_123'
  });

console.log('OKR Progress:', data);

// Complex function with multiple params
const { data, error } = await supabase
  .rpc('get_department_health', {
    dept_id: 'mkt',
    quarter: 'Q4 2025',
    include_inactive: false
  });
```

### Example: Create Custom Function

```sql
-- In Supabase SQL Editor
CREATE OR REPLACE FUNCTION calculate_okr_progress(okr_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  avg_progress INTEGER;
BEGIN
  SELECT ROUND(AVG(
    (kr->>'current')::DECIMAL / (kr->>'target')::DECIMAL * 100
  ))::INTEGER
  INTO avg_progress
  FROM user_okrs,
       jsonb_array_elements(key_results) AS kr
  WHERE id = okr_id;

  RETURN COALESCE(avg_progress, 0);
END;
$$ LANGUAGE plpgsql;
```

```javascript
// Then call from JavaScript
const progress = await supabase
  .rpc('calculate_okr_progress', { okr_id: 'okr_123' });
```

---

## Storage API (Future)

For file uploads (logos, attachments):

```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('attachments')
  .upload(`actions/${actionId}/file.pdf`, file);

// Get public URL
const { data } = supabase.storage
  .from('attachments')
  .getPublicUrl('actions/action_123/file.pdf');

console.log('File URL:', data.publicUrl);

// Download file
const { data, error } = await supabase.storage
  .from('attachments')
  .download('actions/action_123/file.pdf');

// Delete file
const { error } = await supabase.storage
  .from('attachments')
  .remove(['actions/action_123/file.pdf']);
```

---

## Error Handling

### Best Practices

```javascript
async function safeQuery(queryFn) {
  try {
    const { data, error } = await queryFn();

    if (error) {
      // Log to monitoring service (e.g., Sentry)
      console.error('Supabase Error:', error);

      // Show user-friendly message
      showNotification('Error al cargar datos. Intenta de nuevo.', 'error');

      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    showNotification('Error inesperado. Contacta soporte.', 'error');
    return null;
  }
}

// Usage
const actions = await safeQuery(() =>
  supabase.from('roadmap_actions').select('*')
);
```

### Common Errors

```javascript
// Authentication errors
if (error?.message?.includes('Invalid login credentials')) {
  return 'Email o contraseña incorrectos';
}

if (error?.message?.includes('Email not confirmed')) {
  return 'Por favor confirma tu email';
}

// RLS policy violations
if (error?.code === 'PGRST301') {
  return 'No tienes permisos para esta operación';
}

// Network errors
if (error?.message?.includes('Failed to fetch')) {
  return 'Error de conexión. Verifica tu internet.';
}
```

---

## Performance Optimization

### Query Optimization

```javascript
// ❌ BAD: N+1 query problem
const actions = await supabase.from('actions').select('*');
for (const action of actions) {
  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', action.user_id)
    .single();
}

// ✅ GOOD: Single query with join
const { data: actions } = await supabase
  .from('actions')
  .select(`
    *,
    user:users!user_id(email)
  `);

// ❌ BAD: Select all columns
const { data } = await supabase
  .from('actions')
  .select('*');

// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('actions')
  .select('id, title, status, deadline');

// ❌ BAD: Multiple separate queries
const actions = await supabase.from('actions').select('*');
const okrs = await supabase.from('user_okrs').select('*');
const initiatives = await supabase.from('initiatives').select('*');

// ✅ GOOD: Batch queries with Promise.all
const [
  { data: actions },
  { data: okrs },
  { data: initiatives }
] = await Promise.all([
  supabase.from('actions').select('*'),
  supabase.from('user_okrs').select('*'),
  supabase.from('initiatives').select('*')
]);
```

### Caching Strategy

```javascript
// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedData(key, queryFn) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit:', key);
    return cached.data;
  }

  console.log('Cache miss:', key);
  const data = await queryFn();

  cache.set(key, {
    data,
    timestamp: Date.now()
  });

  return data;
}

// Usage
const actions = await getCachedData(
  'actions_q4_2025',
  () => supabase.from('roadmap_actions').select('*').eq('quarter', 'Q4 2025')
);
```

---

## Rate Limiting

Supabase Free Tier limits:
- **100 req/second** per IP
- **10,000 req/hour** total

```javascript
// Simple rate limiter
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      console.log(`Rate limit reached. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquire();
    }

    this.requests.push(now);
  }
}

const limiter = new RateLimiter(50, 1000); // 50 req/second

async function throttledQuery(queryFn) {
  await limiter.acquire();
  return queryFn();
}
```

---

## Webhooks (Future Integration)

Example: Trigger external actions on database changes

```javascript
// Edge Function: webhook-handler
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const payload = await req.json();

  // Send to Slack
  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `New OKR created: ${payload.record.title}`
    })
  });

  // Send to Zapier/Make
  await fetch(ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return new Response('OK', { status: 200 });
});
```

---

## API Monitoring

```javascript
// Track API performance
class APIMonitor {
  static async track(operation, queryFn) {
    const start = Date.now();

    try {
      const result = await queryFn();
      const duration = Date.now() - start;

      console.log(`✅ ${operation}: ${duration}ms`);

      // Send to analytics
      if (window.gtag) {
        gtag('event', 'api_call', {
          operation,
          duration,
          success: true
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;

      console.error(`❌ ${operation}: ${duration}ms`, error);

      // Send error to Sentry
      if (window.Sentry) {
        Sentry.captureException(error, {
          tags: { operation, duration }
        });
      }

      throw error;
    }
  }
}

// Usage
const actions = await APIMonitor.track(
  'load_actions',
  () => supabase.from('roadmap_actions').select('*')
);
```

---

## Testing API Calls

```javascript
// Mock Supabase for testing
class MockSupabase {
  constructor() {
    this.mockData = {
      roadmap_actions: [
        { id: '1', title: 'Test Action', status: 'Pendiente' }
      ]
    };
  }

  from(table) {
    return {
      select: (columns) => ({
        data: this.mockData[table],
        error: null
      }),
      insert: (data) => ({
        data: [data],
        error: null
      })
    };
  }
}

// In tests
const supabase = new MockSupabase();
const { data } = await supabase.from('roadmap_actions').select('*');
console.assert(data.length === 1, 'Should have 1 action');
```

---

**Last Updated:** September 30, 2025
**Version:** 3.0.0-alpha