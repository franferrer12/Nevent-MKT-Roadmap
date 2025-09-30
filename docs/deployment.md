# 🚀 Deployment Guide

> Production deployment, CI/CD, monitoring, and scaling strategies

---

## Current Setup (GitHub Pages)

### Automatic Deployment

Every push to `main` branch auto-deploys to production:

```bash
git push origin main
# Wait ~30 seconds
# Live at: https://franferrer12.github.io/Nevent-MKT-Roadmap/
```

**Pros:**
- ✅ Free hosting
- ✅ Auto SSL certificate
- ✅ CDN included
- ✅ Zero configuration
- ✅ Git-based deployment

**Cons:**
- ❌ No preview environments
- ❌ No rollback UI
- ❌ No deployment notifications
- ❌ No custom domains (free tier)

---

## CI/CD Pipeline (Recommended Upgrade)

### Option 1: GitHub Actions (Free)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Validate HTML
        run: |
          npm install -g html-validate
          html-validate index.html

      - name: Check Links
        uses: gaurav-nelson/github-action-markdown-link-check@v1

      - name: Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          scan-ref: '.'

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .

      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Option 2: Vercel (Preview Deployments)

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy
vercel --prod
```

**`vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Benefits:**
- ✅ Preview URLs for PRs
- ✅ Instant rollbacks
- ✅ Analytics included
- ✅ Custom domains (free)

### Option 3: Netlify (Advanced Features)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**`netlify.toml`:**
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Benefits:**
- ✅ Form handling
- ✅ Split testing
- ✅ Edge functions
- ✅ Analytics

---

## Environments Strategy

### 1. Development (Local)

```bash
# Run locally
python -m http.server 8000
```

**Database:** Use Supabase development project

### 2. Staging (Optional)

**Option A: Separate Branch**
```bash
# Create staging branch
git checkout -b staging
git push origin staging

# Deploy to: username.github.io/repo/staging
```

**Option B: Subdomain**
```
staging.nevent-roadmap.com → Vercel preview
```

### 3. Production

```
franferrer12.github.io/Nevent-MKT-Roadmap/
```

---

## Environment Variables

Currently hardcoded in `index.html`. For better security:

### Option 1: Build-time Injection (Recommended)

```bash
# .env.production
VITE_SUPABASE_URL=https://tvbqzqripcevaryquhfg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...

# Build script
envsubst < index.html.template > index.html
```

### Option 2: Runtime Config

```javascript
// config.js (not committed)
window.APP_CONFIG = {
  supabaseUrl: 'https://...',
  supabaseKey: '...'
};

// index.html
<script src="config.js"></script>
<script>
  const supabase = createClient(
    window.APP_CONFIG.supabaseUrl,
    window.APP_CONFIG.supabaseKey
  );
</script>
```

---

## Rollback Strategy

### GitHub Pages (Manual)

```bash
# Find last good commit
git log --oneline -10

# Revert to it
git revert HEAD
git push origin main

# Or force reset (⚠️ destructive)
git reset --hard abc1234
git push -f origin main
```

### Vercel/Netlify (One-click)

1. Go to dashboard
2. Deployments → Select previous version
3. Click "Rollback"
4. Done in ~10 seconds

---

## Monitoring & Observability

### 1. Uptime Monitoring

**Option: UptimeRobot (Free)**

```yaml
Monitor:
  URL: https://franferrer12.github.io/Nevent-MKT-Roadmap/
  Interval: 5 minutes
  Alerts:
    - Email: fran.ferrer@nevent.es
    - Slack: #engineering
```

**Option: Better Uptime**

```javascript
// Add to index.html
<script src="https://cdn.betteruptime.com/widget.js"></script>
```

### 2. Error Tracking

**Sentry Integration:**

```html
<!-- Add before closing </head> -->
<script
  src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"
  crossorigin="anonymous"
></script>
<script>
  Sentry.init({
    dsn: 'YOUR_DSN',
    environment: 'production',
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    }
  });
</script>
```

### 3. Analytics

**Google Analytics 4:**

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');

  // Track custom events
  gtag('event', 'okr_created', {
    department: 'marketing'
  });
</script>
```

**Plausible (Privacy-first, Recommended):**

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 4. Performance Monitoring

**Web Vitals:**

```javascript
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics({name, value, id}) {
  gtag('event', name, {
    value: Math.round(value),
    event_category: 'Web Vitals',
    event_label: id,
    non_interaction: true
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## Scaling Strategy

### Current Capacity

```yaml
Users: 50 (concurrent)
Actions: ~500/year
Database: ~8 MB
Traffic: ~1000 pageviews/month
```

### Scale to 500 Users

**Frontend (No changes needed):**
- GitHub Pages handles millions of requests
- Static files = unlimited scale

**Backend (Supabase Pro - $25/month):**
- 8 GB database (currently 8 MB = 0.1% used)
- 250 GB bandwidth
- 5000 concurrent connections

**Estimated cost:** $25/month for 2-3 years

### Scale to 5,000 Users

**Frontend:**
- Move to Vercel/Netlify Pro ($20/month)
- Enable CDN caching
- Optimize assets (minify, gzip)

**Backend:**
- Supabase Pro with connection pooling
- Add read replicas if needed ($25/month each)
- Implement caching layer (Redis - $10/month)

**Estimated cost:** $55-80/month

### Scale to 50,000+ Users

**Frontend:**
- CDN with edge caching (Cloudflare)
- Code splitting and lazy loading
- Consider framework (React/Vue)

**Backend:**
- Self-hosted PostgreSQL on AWS/DO ($100-200/month)
- Load balancer ($10/month)
- Redis cluster ($50/month)
- Monitoring suite ($30/month)

**Estimated cost:** $200-300/month

**At this point, consider:**
- Dedicated backend team
- Microservices architecture
- Kubernetes for orchestration

---

## Database Scaling

### Read Replicas

```javascript
// Primary for writes
const supabasePrimary = createClient(PRIMARY_URL, KEY);

// Replica for reads (70% of queries)
const supabaseReplica = createClient(REPLICA_URL, KEY);

// Use replica for SELECT
const { data } = await supabaseReplica
  .from('roadmap_actions')
  .select('*');

// Use primary for INSERT/UPDATE/DELETE
await supabasePrimary
  .from('roadmap_actions')
  .insert({...});
```

### Connection Pooling

```javascript
// Supabase built-in pooler
const supabase = createClient(
  'https://tvbqzqripcevaryquhfg.supabase.co',
  KEY,
  {
    db: {
      pool: {
        min: 0,
        max: 10
      }
    }
  }
);
```

### Query Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_actions_quarter_status
ON actions(quarter, status);

CREATE INDEX CONCURRENTLY idx_initiatives_health
ON initiatives(health) WHERE health != 'on_track';

-- Partial index for active items only
CREATE INDEX idx_active_actions
ON actions(quarter, status)
WHERE status != 'Completado';
```

---

## CDN & Caching

### Cloudflare Setup (Free)

1. Add domain to Cloudflare
2. Point DNS to GitHub Pages IP
3. Enable caching rules:

```
Cache Rules:
  *.html → Cache for 1 hour
  *.css → Cache for 1 day
  *.js → Cache for 1 day
  index.html → Cache for 5 minutes
```

### Cache Headers

```html
<!-- Add to index.html -->
<meta http-equiv="Cache-Control" content="max-age=300">
```

---

## Backup Strategy

### Automated Daily Backups

**GitHub Actions:**

```yaml
# .github/workflows/backup.yml
name: Daily Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup Supabase
        run: |
          pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

      - name: Upload to S3
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_KEY }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET }}
          aws-region: us-east-1

      - run: |
          aws s3 cp backup_$(date +%Y%m%d).sql s3://nevent-backups/
```

---

## Security Checklist

```yaml
Pre-deployment:
  - [ ] Update dependencies
  - [ ] Scan for vulnerabilities (npm audit)
  - [ ] Check for hardcoded secrets
  - [ ] Test all RLS policies
  - [ ] Verify HTTPS enabled
  - [ ] Review CORS settings

Post-deployment:
  - [ ] Monitor error rates
  - [ ] Check performance metrics
  - [ ] Verify backups working
  - [ ] Test rollback procedure
  - [ ] Update team on changes
```

---

## Disaster Recovery

### Scenario 1: GitHub Pages Down

**Backup:** Vercel deployment ready

```bash
# Deploy to Vercel immediately
vercel --prod

# Update DNS
# Point nevent-roadmap.com to Vercel
```

**RTO:** ~5 minutes
**RPO:** 0 (no data loss)

### Scenario 2: Supabase Down

**Backup:** Database dumps on S3

```bash
# Spin up temporary PostgreSQL
docker run -d -p 5432:5432 postgres:15

# Restore from backup
psql $TEMP_DB < latest_backup.sql

# Update connection string
# Deploy with new DATABASE_URL
```

**RTO:** ~30 minutes
**RPO:** Last backup (max 24 hours)

### Scenario 3: Data Corruption

**Restore from point-in-time:**

1. Go to Supabase Dashboard
2. Backups → Select timestamp
3. Restore → New project
4. Update connection string
5. Deploy

**RTO:** ~15 minutes
**RPO:** Depends on backup (daily = max 24h)

---

## Cost Projections

### Current (50 users)

```
GitHub Pages: $0
Supabase Free: $0
Domain: $12/year

Total: $12/year (~$1/month)
```

### Small Scale (500 users)

```
Vercel Hobby: $0
Supabase Pro: $25/month
Domain: $12/year
Monitoring: $0 (free tiers)

Total: ~$25/month
```

### Medium Scale (5,000 users)

```
Vercel Pro: $20/month
Supabase Pro: $25/month
Redis: $10/month
Monitoring: $10/month
Domain: $12/year

Total: ~$65/month
```

### Large Scale (50,000+ users)

```
AWS EC2 (app): $50/month
AWS RDS (PostgreSQL): $100/month
AWS ElastiCache (Redis): $50/month
Load Balancer: $18/month
Monitoring (Datadog): $30/month
CDN (Cloudflare Pro): $20/month

Total: ~$270/month
```

---

**Last Updated:** September 30, 2025
**Version:** 3.0.0-alpha