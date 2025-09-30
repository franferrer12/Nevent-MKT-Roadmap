# 📋 Sprint 2 Backlog - Nevent Platform v3.1.0

**Target Release**: Q1 2026
**Focus**: Accessibility, Advanced Features, Monitoring
**Priority**: Medium (Production Stable)

---

## 🎯 SPRINT GOALS

1. Achieve WCAG 2.1 Level AA compliance
2. Implement advanced search and export features
3. Add production monitoring and error tracking
4. Improve remaining XSS coverage
5. Performance optimization (target: <2s load time)

---

## 🔴 HIGH PRIORITY

### 1. Accessibility (WCAG 2.1 AA)
**Estimated Effort**: 8-12 hours
**Business Value**: Legal compliance + 15% more users

#### Tasks:
- [ ] **Color Contrast Fixes**
  - Current: 2.8:1 (failing)
  - Target: 4.5:1 minimum
  - Affects: Buttons, text, status badges
  - Tool: Use WebAIM Contrast Checker

- [ ] **Keyboard Navigation**
  - Tab order logical for all forms
  - Focus indicators visible (2px outline)
  - Escape key closes modals
  - Arrow keys for dropdown navigation

- [ ] **Screen Reader Support**
  - Add ARIA labels to all interactive elements
  - Announce loading states (`aria-live="polite"`)
  - Table headers properly marked
  - Form validation errors announced

- [ ] **Focus Management**
  - When modal opens, focus first input
  - When modal closes, return focus to trigger
  - Skip navigation links for keyboard users

**Testing**:
- [ ] Test with NVDA screen reader (Windows)
- [ ] Test with VoiceOver (Mac)
- [ ] Keyboard-only navigation test (no mouse)
- [ ] Run Lighthouse accessibility audit (target 95+)

**Files to Update**:
- `index.html` - Add ARIA attributes
- CSS focus styles throughout

---

### 2. Complete XSS Protection
**Estimated Effort**: 4-6 hours
**Business Value**: Security score 8.5 → 9.5

#### Current Coverage:
- ✅ Timeline rendering (9 fields) - **DONE**
- ⏳ Remaining ~25 innerHTML assignments

#### Locations to Fix:
```javascript
// Search for all innerHTML usage:
grep -n "innerHTML" index.html

// Priority areas:
1. Modal titles/content (lines ~2000-2500)
2. Dashboard grids (lines ~4500-5000)
3. Toast messages (lines ~3800-3900)
4. Charts/graphs (lines ~5200-5500)
```

#### Implementation:
```javascript
// Replace all direct innerHTML with:
element.innerHTML = sanitizeHTML(content);

// Or use safer:
safeSetHTML(element, content);
```

**Testing**:
- [ ] Automated XSS payload tests
- [ ] Manual injection attempts in all forms
- [ ] Review with OWASP XSS cheat sheet

---

### 3. Global Search Feature
**Estimated Effort**: 6-8 hours
**Business Value**: 40% faster navigation

#### Requirements:
- Search across OKRs, Initiatives, Actions, Customers
- Keyboard shortcut: `Ctrl+K` or `Cmd+K`
- Real-time results (debounced 300ms)
- Highlight matching text
- Show result type (icon/badge)
- Navigate with arrow keys, Enter to open

#### UI Design:
```
┌─────────────────────────────────────────┐
│ 🔍 Search everything...        Ctrl+K   │
├─────────────────────────────────────────┤
│ 🎯 OKR: Increase NRR to 110%            │
│ 🚀 Initiative: Customer onboarding      │
│ ✅ Action: Implement feature X          │
│ 👤 Customer: Acme Corp                  │
└─────────────────────────────────────────┘
```

#### Implementation:
```javascript
// Create search index on page load
const searchIndex = {
  okrs: [...],
  initiatives: [...],
  actions: [...],
  customers: [...]
};

// Fuzzy search with fuse.js
function search(query) {
  return fuse.search(query, { limit: 10 });
}
```

**Files to Create**:
- Search modal HTML/CSS
- Search logic with debouncing
- Keyboard shortcuts handler

---

## 🟡 MEDIUM PRIORITY

### 4. CSV Export Feature
**Estimated Effort**: 4-5 hours
**Business Value**: Executive reporting

#### Export Options:
- [ ] All OKRs (company + user)
- [ ] All Customers with metrics
- [ ] All Actions by quarter
- [ ] Department health report

#### Format:
```csv
Title,Owner,Status,Progress,Due Date,Quarter
"Increase NRR","John Doe","On Track",75,"2025-12-31","Q4"
```

#### Implementation:
```javascript
function exportToCSV(data, filename) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
```

**Testing**:
- [ ] Excel compatibility
- [ ] Special characters (quotes, commas)
- [ ] Large datasets (1000+ rows)

---

### 5. Email Notifications
**Estimated Effort**: 8-10 hours
**Business Value**: 30% better engagement

#### Notification Types:
- [ ] OKR at risk (progress < 30% with < 30 days left)
- [ ] Action overdue
- [ ] Customer health drops below 50
- [ ] Weekly digest (Fridays)
- [ ] New assignment

#### Implementation Options:
**Option A**: Supabase Edge Functions + SendGrid
**Option B**: Supabase Database Webhooks + Zapier
**Option C**: Client-side with Supabase Realtime

**Recommended**: Option A (most control)

```javascript
// Supabase Edge Function
export async function handler(req) {
  const { type, user_email, data } = await req.json();

  await sendEmail({
    to: user_email,
    subject: getSubject(type),
    html: renderTemplate(type, data)
  });

  return new Response('OK', { status: 200 });
}
```

**User Settings UI**:
```
Notification Preferences:
☑️ OKR at risk
☑️ Action overdue
☐ Customer health drop
☑️ Weekly digest
☐ New assignment
```

---

### 6. Keyboard Shortcuts
**Estimated Effort**: 3-4 hours
**Business Value**: Power user productivity

#### Shortcuts to Add:
```
Global:
- Ctrl+K: Search
- Ctrl+N: New OKR
- Ctrl+,: Settings
- Esc: Close modal
- ?: Show shortcuts help

Navigation:
- G+D: Go to Dashboard
- G+O: Go to OKRs
- G+I: Go to Initiatives
- G+R: Go to Roadmap
- G+C: Go to Customers

Actions:
- Ctrl+S: Save current form
- Ctrl+E: Edit selected item
- Delete: Delete selected item
```

#### Implementation:
```javascript
const shortcuts = {
  'ctrl+k': () => openSearch(),
  'ctrl+n': () => openNewOKRModal(),
  'g+d': () => navigateTo('dashboard'),
  // ...
};

document.addEventListener('keydown', (e) => {
  const key = getKeyCombo(e);
  if (shortcuts[key]) {
    e.preventDefault();
    shortcuts[key]();
  }
});
```

---

## 🟢 LOW PRIORITY

### 7. Performance Optimization
**Estimated Effort**: 6-8 hours
**Current**: ~3.2s initial load
**Target**: <2s initial load

#### Optimizations:
- [ ] **Lazy load images**
  - Use `loading="lazy"` attribute
  - Implement intersection observer

- [ ] **Code splitting**
  - Separate dashboard JS by role
  - Load only what's needed

- [ ] **Cache Supabase queries**
  - Use localStorage for static data
  - Invalidate on mutations

- [ ] **Optimize CSS**
  - Remove unused styles (PurgeCSS)
  - Inline critical CSS

- [ ] **Compress assets**
  - Minify HTML/CSS/JS
  - Use modern image formats (WebP)

**Metrics to Track**:
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3s
- Cumulative Layout Shift (CLS): <0.1

---

### 8. Dark Mode
**Estimated Effort**: 4-6 hours
**Business Value**: User preference

#### Implementation:
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --border-color: #333333;
}
```

```javascript
function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

**UI**:
- Toggle in user menu
- Respect system preference (`prefers-color-scheme`)
- Smooth transition animation

---

### 9. Advanced Analytics Dashboard
**Estimated Effort**: 10-12 hours
**Business Value**: Data-driven decisions

#### Metrics to Add:
- OKR velocity (completion rate over time)
- Team performance comparison
- Customer cohort analysis
- Initiative ROI tracking
- Time to completion trends

#### Visualizations:
- Line charts (progress over time)
- Bar charts (team comparison)
- Heat maps (activity calendar)
- Funnel charts (customer journey)

#### Tools:
- Chart.js or Recharts
- D3.js for complex visualizations

---

## 🔧 MONITORING & OBSERVABILITY

### 10. Error Tracking (Sentry)
**Estimated Effort**: 2-3 hours
**Cost**: Free tier (5,000 events/month)

#### Setup:
```html
<script
  src="https://browser.sentry-cdn.com/7.x/bundle.min.js"
  crossorigin="anonymous"
></script>

<script>
Sentry.init({
  dsn: "YOUR_DSN",
  environment: "production",
  release: "v3.0.1",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
</script>
```

#### Benefits:
- Real-time error alerts
- Stack traces with source maps
- User session replays
- Performance monitoring

---

### 11. Analytics (Plausible or Umami)
**Estimated Effort**: 1-2 hours
**Cost**: Free (self-hosted) or $9/month

#### Metrics to Track:
- Page views
- User flow (dashboard → OKRs → create)
- Feature adoption (onboarding completion %, search usage)
- Error rates
- Session duration

#### Privacy-Friendly:
- No cookies
- GDPR compliant
- Lightweight (<1kb)

---

### 12. Uptime Monitoring
**Estimated Effort**: 1 hour
**Tool**: UptimeRobot (free)

#### Setup:
- Monitor: https://franferrer12.github.io/Nevent-MKT-Roadmap/
- Check interval: 5 minutes
- Alert: Email + Slack

---

## 📊 ESTIMATED TIMELINE

| Phase | Tasks | Effort | Timeline |
|-------|-------|--------|----------|
| **Phase 1** | Accessibility + XSS | 12-18h | Week 1-2 |
| **Phase 2** | Search + Export | 10-13h | Week 3-4 |
| **Phase 3** | Notifications + Shortcuts | 11-14h | Week 5-6 |
| **Phase 4** | Monitoring + Performance | 9-13h | Week 7-8 |
| **Phase 5** | Testing + Docs | 6-8h | Week 9 |

**Total Effort**: 48-66 hours (~2 months part-time)

---

## ✅ DEFINITION OF DONE

Each feature must have:
- [ ] Implementation complete
- [ ] Unit tests (if applicable)
- [ ] Manual testing passed
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Performance impact measured
- [ ] Deployed to production
- [ ] User feedback collected

---

## 🎯 SUCCESS METRICS

### Sprint 2 Goals:
- Accessibility Score: 70 → 95+ (Lighthouse)
- Security Score: 8.5 → 9.5+
- Performance Score: 75 → 90+
- User Satisfaction: Collect NPS score
- Feature Adoption: Track usage of new features

---

## 📝 NOTES

### Risks:
1. **Accessibility work is tedious** - May take longer than estimated
2. **Email notifications require backend** - Need Supabase Edge Functions
3. **Performance optimization** - Requires careful testing to avoid regressions

### Dependencies:
- Supabase Edge Functions (for emails)
- Chart.js library (for analytics)
- Fuse.js library (for search)
- Sentry account (for monitoring)

### Nice to Have (Future Sprints):
- Mobile app (React Native)
- Slack/Teams integration
- AI-powered insights
- Multi-language support
- White-label option

---

**Document Version**: 1.0
**Created**: 2025-09-30
**Owner**: fran.ferrer@nevent.es
**Review Cycle**: Bi-weekly sprint planning
