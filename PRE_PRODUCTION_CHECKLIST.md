# 🚀 Pre-Production Checklist - Nevent v3.0.0

**Fecha**: 2025-09-30
**Versión**: 3.0.0
**Target Deploy**: GitHub Pages

---

## ✅ **FASE 1: Database Setup (CRÍTICO)**

### 1.1 Ejecutar Migraciones en Supabase
- [ ] Ir a Supabase Dashboard → SQL Editor
- [ ] Ejecutar `migrations/PRODUCTION_SETUP.sql`
- [ ] Verificar que se crearon 7 tablas:
  - [ ] `public.users`
  - [ ] `public.departments`
  - [ ] `public.customers`
  - [ ] `public.company_okrs`
  - [ ] `public.user_okrs`
  - [ ] `public.initiatives`
  - [ ] `public.actions`

### 1.2 Crear Test Users en Supabase Auth
- [ ] Ir a Authentication → Users → Add User
- [ ] Crear 4 usuarios:
  - [ ] `ceo@nevent.es` / `Test1234!` (Auto Confirm: YES)
  - [ ] `director@nevent.es` / `Test1234!` (Auto Confirm: YES)
  - [ ] `csm@nevent.es` / `Test1234!` (Auto Confirm: YES)
  - [ ] `user@nevent.es` / `Test1234!` (Auto Confirm: YES)

### 1.3 Verificar Trigger de Profiles
```sql
-- Ejecutar en SQL Editor:
SELECT id, email, role, full_name
FROM public.users
WHERE email LIKE '%@nevent.es';
```
- [ ] Confirmar que los 4 usuarios tienen roles correctos
- [ ] CEO → role='ceo'
- [ ] Director → role='director'
- [ ] CSM → role='csm'
- [ ] User → role='user'

### 1.4 Seed Data de Departments
```sql
SELECT * FROM public.departments ORDER BY name;
```
- [ ] Confirmar 7 departamentos existen
- [ ] Marketing, Sales, Product, Engineering, CS, Operations, Finance

---

## ✅ **FASE 2: Testing Manual (30 min)**

### 2.1 Login & Authentication
- [ ] Login con `ceo@nevent.es` → Ver CEO Dashboard
- [ ] Login con `director@nevent.es` → Ver Director Dashboard
- [ ] Login con `csm@nevent.es` → Ver CS Dashboard
- [ ] Login con `user@nevent.es` → Solo User Dashboard
- [ ] Logout funciona correctamente

### 2.2 Confirmation Dialogs
- [ ] Eliminar un customer → Modal custom aparece (no alert)
- [ ] Modal muestra nombre del cliente
- [ ] Botón rojo "Sí, eliminar"
- [ ] Presionar ESC → cierra modal sin eliminar
- [ ] Click "Cancelar" → cierra modal sin eliminar
- [ ] Click "Sí, eliminar" → elimina y muestra toast

### 2.3 View As System (CEO only)
- [ ] Login como CEO
- [ ] Click botón "👤 CEO" → Dropdown aparece
- [ ] Seleccionar "user@nevent.es"
- [ ] Banner rosa sticky aparece arriba
- [ ] Container tiene borde rosa de 4px
- [ ] Banner hace pulse animation
- [ ] Solo ve User Dashboard (tabs CEO/Director ocultas)
- [ ] Click "↩️ Volver a mi cuenta" → Banner desaparece
- [ ] Vuelve a tener acceso completo CEO

### 2.4 Analytics Tracking
- [ ] Abrir DevTools → Console
- [ ] Login → Ver "📊 Analytics: user_login"
- [ ] Cambiar vista → Ver "📊 Analytics: view_changed"
- [ ] Crear customer → Ver "📊 Analytics: customer_created"
- [ ] En console: `analytics.getEvents()` → Ver array de eventos
- [ ] En console: `analytics.clearEvents()` → Limpia correctamente

### 2.5 Customer Success Dashboard
- [ ] Crear nuevo cliente con todos los campos
- [ ] Health Score se calcula automáticamente
- [ ] Editar cliente → Cambiar MRR → Health Score actualiza
- [ ] Filtros de segmentación funcionan (All/Active/At Risk/Churned)
- [ ] NRR & Churn Rate se muestran correctamente
- [ ] Sync manual con Company OKRs funciona (botón ⏳ → ✅)

### 2.6 Company OKRs (CEO only)
- [ ] Crear Company OKR con 3-5 Key Results
- [ ] Progress bars se muestran correctamente
- [ ] Health score se calcula automáticamente
- [ ] Aparece en CEO Dashboard inmediatamente

### 2.7 User OKRs & Initiatives
- [ ] Crear User OKR personal
- [ ] Añadir 2-3 Key Results dinámicamente
- [ ] Progress se calcula automáticamente
- [ ] Crear Initiative vinculada a OKR
- [ ] Budget tracking funciona (allocated vs spent)

### 2.8 Responsive Design
- [ ] Resize a 375px (mobile) → Todo funciona
- [ ] Resize a 768px (tablet) → Todo funciona
- [ ] Resize a 1920px (desktop) → Todo funciona
- [ ] Banner View As se adapta en mobile
- [ ] Modales se ven completos en mobile

---

## ✅ **FASE 3: Tests Automatizados**

### 3.1 Ejecutar Test Suite
```bash
cd "D:\HERRAMIENTA TRABAJO\Nevent-MKT-Roadmap"
node tests/automated-tests.mjs
```

**Expected Results:**
- [ ] Pass Rate ≥ 90%
- [ ] Database Integrity: 100% passed
- [ ] Authentication & Roles: 100% passed
- [ ] Customer Success: 100% passed
- [ ] OKR System: 100% passed
- [ ] Analytics: 100% passed

### 3.2 Revisar Fallos
Si hay tests fallidos:
- [ ] Leer error messages en detalle
- [ ] Verificar RLS policies en Supabase
- [ ] Verificar que todas las tablas existen
- [ ] Re-ejecutar tests después de fixes

---

## ✅ **FASE 4: Performance & Optimization**

### 4.1 Lighthouse Audit
- [ ] Abrir DevTools → Lighthouse
- [ ] Run audit (Desktop)
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 80

### 4.2 Bundle Size
- [ ] Verificar `index.html` < 500KB
- [ ] Verificar que CDN links funcionan (Supabase, CDN)
- [ ] Sin errores de carga en Network tab

### 4.3 Supabase Free Tier Limits
```sql
-- Tamaño de DB
SELECT pg_size_pretty(pg_database_size('postgres')) as db_size;

-- Row counts
SELECT
  'users' as table_name, COUNT(*) as rows FROM public.users
UNION ALL
SELECT 'customers', COUNT(*) FROM public.customers
UNION ALL
SELECT 'company_okrs', COUNT(*) FROM public.company_okrs;
```
- [ ] DB size < 100MB (límite 500MB)
- [ ] Bandwidth usage < 500MB/mes (límite 2GB)
- [ ] < 50 usuarios activos/mes

---

## ✅ **FASE 5: Documentación**

### 5.1 README actualizado
- [ ] Badges de versión actualizados
- [ ] Screenshots actualizados
- [ ] Installation instructions correctas
- [ ] Test users documentados

### 5.2 CHANGELOG completo
- [ ] Todas las features v3.0.0 listadas
- [ ] UX improvements documentadas
- [ ] Breaking changes indicadas
- [ ] Migration guide incluida

### 5.3 Archivos adicionales
- [ ] `TEST_USERS.md` actualizado
- [ ] `PRODUCTION_SETUP.sql` validado
- [ ] `progress-dashboard.html` accesible

---

## ✅ **FASE 6: Deploy a GitHub Pages**

### 6.1 Pre-Deploy Checks
- [ ] Todas las credenciales sensibles removidas
- [ ] Supabase API Key es anon key (no service_role)
- [ ] No hay console.logs de debug
- [ ] 404.html existe
- [ ] favicon.ico existe

### 6.2 Git Workflow
```bash
# Commit final
git add .
git commit -m "feat(release): v3.0.0 production ready"

# Tag version
git tag -a v3.0.0 -m "Release v3.0.0 - Strategic Execution Platform"
git push origin main --tags

# Verify GitHub Pages
# Go to Settings → Pages
# Source: Deploy from branch main → / (root)
```

- [ ] Commit con mensaje descriptivo
- [ ] Tag v3.0.0 creado
- [ ] Push a main con tags
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Branch: main, Folder: / (root)

### 6.3 Post-Deploy Verification
- [ ] Esperar 2-3 minutos para build
- [ ] Abrir https://franferrer12.github.io/Nevent-MKT-Roadmap/
- [ ] Login funciona en producción
- [ ] Supabase connection funciona
- [ ] No errores en console
- [ ] SSL certificate válido (HTTPS)

### 6.4 Test en Producción
- [ ] Login con los 4 test users
- [ ] Crear 1 customer de prueba
- [ ] Crear 1 Company OKR
- [ ] View As system funciona
- [ ] Analytics se persisten en localStorage

---

## ✅ **FASE 7: Monitoring & Post-Deploy**

### 7.1 Setup Monitoring
- [ ] Supabase Dashboard → Bookmarked
- [ ] GitHub Actions → Verificar builds
- [ ] Error tracking (Sentry opcional)

### 7.2 Backup Strategy
- [ ] Exportar schema de Supabase (SQL dump)
- [ ] Guardar en `migrations/backup_YYYYMMDD.sql`
- [ ] Commit a repo

### 7.3 Communication
- [ ] Notificar a equipo sobre deploy
- [ ] Compartir URL de producción
- [ ] Compartir credenciales de test users
- [ ] Compartir link a progress dashboard

---

## 📊 **Resumen de Checklist**

```
Total Items: 85
Completadas: 0/85

Critical Path:
1. Database Setup (MUST COMPLETE FIRST)
2. Manual Testing
3. Automated Tests
4. Deploy

Estimated Time:
- Database: 30 min
- Manual Testing: 30 min
- Automated Tests: 15 min
- Deploy: 20 min
Total: ~2 hours
```

---

## 🚨 **Rollback Plan**

Si algo sale mal en producción:

1. **Revert Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Database Rollback:**
   ```sql
   -- Restore from backup
   -- migrations/backup_YYYYMMDD.sql
   ```

3. **Communication:**
   - Notificar equipo inmediatamente
   - Investigar logs en Supabase
   - Fix en local, re-deploy

---

## ✅ **Sign-Off**

- [ ] **Database Lead**: Tables created, RLS verified
- [ ] **QA Lead**: All tests passed (manual + auto)
- [ ] **Tech Lead**: Code reviewed, performance OK
- [ ] **Product Lead**: Features validated, ready for users

**Deployment Approved**: ____________
**Date**: ____________
**Deploy Engineer**: ____________

---

**Última actualización**: 2025-09-30
**Versión Checklist**: 1.0
**Mantenido por**: fran.ferrer@nevent.es