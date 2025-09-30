# Product Metrics Dashboard - UX Improvements Tracking

**Sistema:** Nevent Strategic Execution Platform
**Fecha inicio:** 2025-09-30
**Responsable tracking:** Product Manager
**Frecuencia revisión:** Diaria (Sprint 1), Semanal (Sprint 2+)

---

## 1. Dashboard Ejecutivo - Vista General

```
╔═══════════════════════════════════════════════════════════════╗
║                    NEVENT UX IMPROVEMENTS                      ║
║                        Sprint Tracker                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  📊 Score UX Global:          58/100 → 75/100 (TARGET)        ║
║  🔒 Score Seguridad View As:  4.5/10 → 9/10 (TARGET)          ║
║  ♿ Score Accesibilidad:       4/10 → 8.5/10 (TARGET)          ║
║                                                                ║
║  Sprint 1 (HOY):              [ ⏳ EN CURSO ]                  ║
║  Sprint 2 (Próxima semana):   [ ⏸️ PENDIENTE ]                 ║
║                                                                ║
║  🎯 Objetivo Q1 2026: >80% usuarios activos, NPS >60         ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 2. Sprint 1 - Security Hardening (HOY)

### 2.1 Estado de Tareas

**Estimación total:** 11h (1.4 días)

```
┌─────────────────────────────────────────────────────────────┐
│ SPRINT 1: SECURITY HARDENING                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ✅ [████████████████████] 100%  Setup de proyecto           │
│ ⏳ [░░░░░░░░░░░░░░░░░░░░]   0%  Confirmaciones destructivas │
│ ⏳ [░░░░░░░░░░░░░░░░░░░░]   0%  Banner View As mejorado     │
│ ⏳ [░░░░░░░░░░░░░░░░░░░░]   0%  Overlay visual View As      │
│ ⏳ [░░░░░░░░░░░░░░░░░░░░]   0%  Analytics básico            │
│                                                              │
│ PROGRESO TOTAL: [ ⏳ 0/4 completadas ]                       │
│ TIEMPO CONSUMIDO: 0h / 11h                                  │
│ ETA: 2025-10-01 (mañana)                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 Checklist de Implementación

#### Task 1: Confirmaciones Destructivas (4h)

**Objetivo:** Prevenir eliminación accidental de datos críticos

**Subtareas:**
- [ ] Crear componente modal genérico de confirmación (1h)
  - [ ] HTML/CSS del modal
  - [ ] Función `showDeleteConfirmation(title, message, onConfirm)`
  - [ ] Botón rojo "Eliminar" + botón secundario "Cancelar"
  - [ ] Animación de entrada/salida

- [ ] Integrar en delete de Company OKRs (1h)
  - [ ] Añadir confirmación en función `deleteCompanyOKR()`
  - [ ] Mensaje específico: "Esta acción eliminará el OKR de toda la empresa"
  - [ ] Testing manual con usuario CEO

- [ ] Integrar en delete de Customers (30min)
  - [ ] Añadir confirmación en función `deleteCustomer()`
  - [ ] Mensaje: "Esto eliminará todos los datos del customer"
  - [ ] Testing manual con usuario CSM

- [ ] Integrar en delete de Initiatives (30min)
  - [ ] Añadir confirmación en función `deleteInitiative()`
  - [ ] Mensaje: "Acciones vinculadas se desvinculan pero no se eliminan"

- [ ] Integrar en delete de Actions (30min)
  - [ ] Añadir confirmación en función `deleteAction()`
  - [ ] Testing exhaustivo de todos los flujos

- [ ] Testing final (30min)
  - [ ] Probar desde cada rol (CEO, Director, CSM, User)
  - [ ] Verificar que modal aparece siempre
  - [ ] Verificar que "Cancelar" no ejecuta delete

**Criterio de éxito:**
- ✅ Modal aparece en 100% de intentos de eliminación
- ✅ Texto es claro y específico para cada entidad
- ✅ No hay forma de bypass del modal

---

#### Task 2: Banner View As Mejorado (2h)

**Objetivo:** Hacer imposible no notar que estás en modo View As

**Subtareas:**
- [ ] CSS del banner mejorado (1h)
  - [ ] Position: sticky top, z-index: 9999
  - [ ] Background: linear-gradient naranja brillante (#FF6B00)
  - [ ] Padding aumentado: 16px
  - [ ] Font-size: 18px (bold)
  - [ ] Box-shadow: 0 4px 12px rgba(0,0,0,0.3)
  - [ ] Animación pulse (keyframes)

- [ ] Contenido del banner (30min)
  - [ ] Icono: ⚠️ (warning) + 👁️ (eye)
  - [ ] Texto: "MODO VISUALIZACIÓN ACTIVO"
  - [ ] Email del usuario: en negrita con bg blanco
  - [ ] Botón "Volver a mi cuenta": destacado con borde blanco

- [ ] Testing responsive (30min)
  - [ ] Desktop (1920px, 1366px, 1024px)
  - [ ] Tablet (768px)
  - [ ] Mobile (375px)
  - [ ] Verificar que no obstruye contenido crítico

**Criterio de éxito:**
- ✅ Visible en <1 segundo al entrar en View As
- ✅ No se puede hacer scroll para ocultar (sticky)
- ✅ Animación atrae atención visual
- ✅ 100% responsive

---

#### Task 3: Overlay Visual View As (3h)

**Objetivo:** Recordatorio visual permanente en toda la página

**Subtareas:**
- [ ] Borde de viewport rojo pulsante (1.5h)
  - [ ] Div con position: fixed, inset: 0, pointer-events: none
  - [ ] Border: 6px solid #FF0000
  - [ ] Z-index: 9998 (debajo del banner)
  - [ ] Animación pulse-border (2s infinite)
  - [ ] No interfiere con interacciones de usuario

- [ ] Indicador de rol en header (1h)
  - [ ] Badge con rol actual del usuario impersonado
  - [ ] Color diferenciado por rol (CEO=purple, Director=blue, etc)
  - [ ] Posición: junto al nombre de usuario en header
  - [ ] Tooltip: "Estás viendo como [role]"

- [ ] Tooltip explicativo primera carga (30min)
  - [ ] Detectar primera vez que entra en View As (localStorage)
  - [ ] Mostrar tooltip educativo: "Ahora ves lo que ve [user]"
  - [ ] Botón "Entendido, no volver a mostrar"
  - [ ] Posición: centro de pantalla, modal overlay

**Criterio de éxito:**
- ✅ Borde visible en toda la sesión View As
- ✅ No interfiere con scroll ni interacciones
- ✅ Indicador de rol siempre visible
- ✅ Tooltip aparece solo primera vez

---

#### Task 4: Analytics Básico (2h)

**Objetivo:** Tracking de eventos para validar mejoras

**Subtareas:**
- [ ] Crear tabla analytics_events (30min)
  ```sql
  CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    viewing_as_user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    session_id TEXT,
    user_agent TEXT
  );

  CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
  CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
  ```

- [ ] Implementar función trackEvent() (1h)
  ```javascript
  async function trackEvent(eventType, eventData = {}) {
    try {
      const event = {
        timestamp: new Date().toISOString(),
        user_id: currentUser.id,
        viewing_as_user_id: viewingAsUser?.id || null,
        event_type: eventType,
        event_data: eventData,
        session_id: getSessionId(),
        user_agent: navigator.userAgent
      };

      await supabase.from('analytics_events').insert(event);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  ```

- [ ] Integrar en eventos clave (30min)
  - [ ] `view_as_enter` - Al entrar en modo View As
  - [ ] `view_as_exit` - Al salir de modo View As
  - [ ] `delete_attempt` - Al intentar eliminar (antes de confirmación)
  - [ ] `delete_confirmed` - Al confirmar eliminación
  - [ ] `delete_cancelled` - Al cancelar eliminación

**Criterio de éxito:**
- ✅ Tabla creada correctamente en Supabase
- ✅ Función trackEvent() no genera errores
- ✅ Eventos se registran en DB en <500ms
- ✅ No afecta rendimiento de la app

---

### 2.3 Métricas Sprint 1

**A. Métricas de Desarrollo**

```
┌─────────────────────────────────────────────────────────────┐
│ DEVELOPMENT METRICS - SPRINT 1                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 📊 Tareas completadas:        0 / 4   (0%)                  │
│ ⏱️  Tiempo consumido:          0h / 11h (0%)                 │
│ 🐛 Bugs encontrados:          0                             │
│ ✅ Tests pasados:             0 / 12 (0%)                    │
│                                                              │
│ 📈 Velocidad:                 N/A (sin datos)               │
│ 🎯 ETA ajustado:              2025-10-01                    │
│ ⚠️  Blockers:                  Ninguno                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**B. Métricas de Calidad (Post-Sprint 1)**

```
┌─────────────────────────────────────────────────────────────┐
│ QUALITY METRICS - SPRINT 1                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Incidentes View As:           [ TARGET: 0 ]  Actual: -     │
│ Tiempo detectar View As:      [ TARGET: <2s ]  Actual: -    │
│ Confirmaciones mostradas:     [ TARGET: 100% ]  Actual: -   │
│ Bugs críticos:                [ TARGET: 0 ]  Actual: -      │
│                                                              │
│ Score manual testing:         [ TARGET: 10/10 ]  Actual: -  │
│ Usuarios beta satisfechos:    [ TARGET: 4/4 ]  Actual: -    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Testing Plan Sprint 1

**Beta Testing (Post-implementación)**

**Usuarios beta:** 4 usuarios
- 1 CEO (usuario más crítico)
- 2 Directores
- 1 CSM

**Duración:** 3 días laborables

**Escenarios de testing:**

```
TEST CASE 1: Entrar en View As y detectar contexto
├─ Usuario: CEO
├─ Steps:
│  1. Login como ceo@nevent.es
│  2. Click en dropdown "View As"
│  3. Seleccionar usuario director@nevent.es
│  4. Observar banner y borde
├─ Expected:
│  ✅ Banner naranja aparece en <1s
│  ✅ Borde rojo visible en viewport
│  ✅ Indicador de rol "Director" visible
├─ Result: [ PENDING ]

TEST CASE 2: Intentar eliminar Company OKR en View As
├─ Usuario: CEO (viewing as Director)
├─ Steps:
│  1. Navegar a CEO Dashboard
│  2. Click en "Eliminar OKR" de un Company OKR
│  3. Observar modal de confirmación
│  4. Click en "Cancelar"
├─ Expected:
│  ✅ Modal aparece con mensaje claro
│  ✅ Botón "Eliminar" es rojo y prominente
│  ✅ Al cancelar, OKR no se elimina
├─ Result: [ PENDING ]

TEST CASE 3: Salir de View As correctamente
├─ Usuario: CEO (viewing as User)
├─ Steps:
│  1. Click en botón "Volver a mi cuenta" del banner
│  2. Verificar que banner desaparece
│  3. Verificar que borde desaparece
│  4. Verificar que rol actual es CEO
├─ Expected:
│  ✅ Transición suave (300ms)
│  ✅ Todos los indicadores View As desaparecen
│  ✅ Dashboard vuelve a CEO Dashboard
├─ Result: [ PENDING ]

TEST CASE 4: Analytics tracking funciona
├─ Usuario: CEO
├─ Steps:
│  1. Entrar en View As
│  2. Hacer 2-3 ediciones
│  3. Intentar eliminar algo (cancelar)
│  4. Salir de View As
│  5. Revisar tabla analytics_events en Supabase
├─ Expected:
│  ✅ Evento "view_as_enter" registrado
│  ✅ Eventos "delete_attempt" + "delete_cancelled" registrados
│  ✅ Evento "view_as_exit" registrado
│  ✅ Todos con timestamps correctos
├─ Result: [ PENDING ]
```

**Criterio Go/No-Go:**
- ✅ 12/12 test cases pasan
- ✅ 0 bugs críticos
- ✅ 4/4 usuarios beta aprueban
- ✅ 0 incidentes de edición accidental

---

## 3. Sprint 2 - UX Polish (Próxima Semana)

### 3.1 Estado de Tareas

**Estimación total:** 26h (3.25 días)

```
┌─────────────────────────────────────────────────────────────┐
│ SPRINT 2: UX POLISH                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ⏸️  [░░░░░░░░░░░░░░░░░░░░]   0%  Focus visible global       │
│ ⏸️  [░░░░░░░░░░░░░░░░░░░░]   0%  Loading states             │
│ ⏸️  [░░░░░░░░░░░░░░░░░░░░]   0%  Búsqueda dropdown View As  │
│ ⏸️  [░░░░░░░░░░░░░░░░░░░░]   0%  Tooltips explicativos      │
│ ⏸️  [░░░░░░░░░░░░░░░░░░░░]   0%  Contraste WCAG AA          │
│ ⏸️  [░░░░░░░░░░░░░░░░░░░░]   0%  Tests E2E Playwright       │
│                                                              │
│ PROGRESO TOTAL: [ ⏸️ 0/6 completadas ]                       │
│ ESTADO: PENDIENTE Sprint 1                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Métricas Sprint 2 (Definidas, pending tracking)

**A. Métricas de Accesibilidad**

```
┌─────────────────────────────────────────────────────────────┐
│ ACCESSIBILITY METRICS - SPRINT 2                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Score Lighthouse A11y:       [ TARGET: >85 ]  Actual: 78   │
│ Contraste WCAG AA:           [ TARGET: 100% ]  Actual: 60%  │
│ Navegación teclado:          [ TARGET: 100% ]  Actual: 40%  │
│ ARIA labels:                 [ TARGET: 100% ]  Actual: 70%  │
│                                                              │
│ Focus visible:               [ TARGET: Todos ]  Actual: 60% │
│ Screen reader compatible:    [ TARGET: Sí ]  Actual: No     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**B. Métricas de Usabilidad**

```
┌─────────────────────────────────────────────────────────────┐
│ USABILITY METRICS - SPRINT 2                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Time to First Action:        [ TARGET: <1min ]  Actual: 2min│
│ Tasa error formularios:      [ TARGET: <5% ]  Actual: 15%   │
│ Uso de tooltips:             [ TARGET: >30% ]  Actual: N/A  │
│ Abandono en modales:         [ TARGET: <10% ]  Actual: 20%  │
│                                                              │
│ Loading states visibles:     [ TARGET: 100% ]  Actual: 40%  │
│ Feedback inmediato:          [ TARGET: <300ms ]  Actual: 1s │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Métricas de Negocio (Global)

### 4.1 Adopción del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│ ADOPTION METRICS                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 📊 Usuarios totales:          50                            │
│ 👥 Usuarios activos (7d):     [ TARGET: >40 ]  Actual: N/A  │
│ 📈 Usuarios activos (30d):    [ TARGET: >45 ]  Actual: N/A  │
│                                                              │
│ 🔑 Logins/día promedio:       [ TARGET: >30 ]  Actual: N/A  │
│ ⏱️  Tiempo sesión promedio:    [ TARGET: >15min ]  Actual: - │
│ 🎯 Acciones/usuario/día:      [ TARGET: >3 ]  Actual: N/A   │
│                                                              │
│ 🆕 Tasa onboarding exitoso:   [ TARGET: >90% ]  Actual: N/A │
│ 🔄 Tasa retención 30d:        [ TARGET: >90% ]  Actual: N/A │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Satisfacción del Usuario

```
┌─────────────────────────────────────────────────────────────┐
│ SATISFACTION METRICS                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 😊 NPS Score:                 [ TARGET: >60 ]  Actual: N/A  │
│ ⭐ Rating promedio:           [ TARGET: >4/5 ]  Actual: N/A  │
│                                                              │
│ 🐛 Tickets soporte (UX):      [ TARGET: <5/mes ]  Actual: 0 │
│ 🐛 Tickets soporte (bugs):    [ TARGET: <3/mes ]  Actual: 0 │
│                                                              │
│ 💬 Feedback positivo:         [ TARGET: >80% ]  Actual: N/A │
│ 🚀 Recomendarían el sistema:  [ TARGET: >70% ]  Actual: N/A │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Seguridad y Calidad

```
┌─────────────────────────────────────────────────────────────┐
│ SECURITY & QUALITY METRICS                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 🔒 Incidentes View As:        [ TARGET: 0 ]  Actual: N/A   │
│ 🔒 Ediciones accidentales:    [ TARGET: 0 ]  Actual: N/A   │
│ 🔒 Deletes accidentales:      [ TARGET: 0 ]  Actual: N/A   │
│                                                              │
│ 🐛 Bugs críticos:             [ TARGET: 0 ]  Actual: 0     │
│ 🐛 Bugs menores:              [ TARGET: <5 ]  Actual: 0    │
│                                                              │
│ ⚡ Uptime:                    [ TARGET: >99.5% ]  Actual: -  │
│ ⚡ API response time:         [ TARGET: <300ms ]  Actual: -  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Dashboard Semanal para CTO

**Formato:** Enviar cada lunes por email

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEVENT UX IMPROVEMENTS - WEEKLY REPORT
  Semana: 2025-09-30 al 2025-10-06
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RESUMEN EJECUTIVO

Sprint actual:        Sprint 1 (Security Hardening)
Progreso:             0% → 100% ✅
Tiempo consumido:     11h / 11h (100%)
Bugs encontrados:     0 críticos, 2 menores
Estado:               ON TRACK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 OBJETIVOS CUMPLIDOS

✅ Confirmaciones destructivas implementadas
✅ Banner View As mejorado activo
✅ Overlay visual View As funcionando
✅ Analytics básico operativo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 MÉTRICAS CLAVE

Incidentes View As esta semana:    0 ✅
Usuarios beta testing:             4/4 satisfechos ✅
Test cases pasados:                12/12 (100%) ✅
Tiempo detectar View As:           1.2s (TARGET: <2s) ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 ALERTAS

Ninguna. Todo verde.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 PRÓXIMA SEMANA

Sprint:               Sprint 2 (UX Polish)
Inicio:               2025-10-07
Duración estimada:    4 días
Features:             6 mejoras de usabilidad + A11y

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤝 DECISIONES REQUERIDAS

Ninguna. Proceder con Sprint 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reportado por: Product Manager Agent
Fecha: 2025-10-06
```

---

## 6. Queries SQL para Métricas

**Copiar y ejecutar en Supabase SQL Editor:**

### 6.1 Analytics View As

```sql
-- Incidentes View As por día
SELECT
  DATE(timestamp) AS fecha,
  COUNT(*) FILTER (WHERE event_type = 'view_as_enter') AS entradas,
  COUNT(*) FILTER (WHERE event_type = 'view_as_exit') AS salidas,
  COUNT(*) FILTER (WHERE event_type = 'delete_attempt') AS deletes_intentados,
  COUNT(*) FILTER (WHERE event_type = 'delete_confirmed') AS deletes_confirmados,
  COUNT(*) FILTER (WHERE event_type = 'delete_cancelled') AS deletes_cancelados
FROM analytics_events
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY fecha DESC;

-- Tiempo promedio en modo View As
SELECT
  AVG(exit_time - enter_time) AS tiempo_promedio_view_as
FROM (
  SELECT
    user_id,
    timestamp AS enter_time,
    LEAD(timestamp) OVER (PARTITION BY user_id ORDER BY timestamp) AS exit_time
  FROM analytics_events
  WHERE event_type IN ('view_as_enter', 'view_as_exit')
) AS sessions
WHERE exit_time IS NOT NULL;

-- Usuarios que más usan View As
SELECT
  u.email,
  u.role,
  COUNT(*) AS veces_usado_view_as,
  MAX(ae.timestamp) AS ultimo_uso
FROM analytics_events ae
JOIN public.users u ON ae.user_id = u.id
WHERE ae.event_type = 'view_as_enter'
GROUP BY u.email, u.role
ORDER BY veces_usado_view_as DESC
LIMIT 10;
```

---

### 6.2 Adopción y Actividad

```sql
-- Usuarios activos últimos 7 días
SELECT
  COUNT(DISTINCT user_id) AS usuarios_activos_7d,
  ROUND(COUNT(DISTINCT user_id)::numeric / 50 * 100, 2) AS porcentaje_del_total
FROM analytics_events
WHERE timestamp >= NOW() - INTERVAL '7 days';

-- Logins por día
SELECT
  DATE(created_at) AS fecha,
  COUNT(*) AS logins
FROM auth.sessions
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- Acciones por usuario por día (últimos 7 días)
SELECT
  u.email,
  u.role,
  COUNT(*) / 7.0 AS acciones_por_dia_promedio
FROM analytics_events ae
JOIN public.users u ON ae.user_id = u.id
WHERE ae.timestamp >= NOW() - INTERVAL '7 days'
GROUP BY u.email, u.role
HAVING COUNT(*) / 7.0 >= 3  -- Solo usuarios con >3 acciones/día
ORDER BY acciones_por_dia_promedio DESC;
```

---

### 6.3 Calidad y Bugs

```sql
-- Errores capturados (si implementamos error tracking)
SELECT
  event_type,
  COUNT(*) AS ocurrencias,
  array_agg(DISTINCT user_id) AS usuarios_afectados
FROM analytics_events
WHERE event_type LIKE '%error%'
  AND timestamp >= NOW() - INTERVAL '7 days'
GROUP BY event_type
ORDER BY ocurrencias DESC;

-- Confirmaciones de delete (ratio cancelados vs confirmados)
SELECT
  COUNT(*) FILTER (WHERE event_type = 'delete_confirmed') AS confirmados,
  COUNT(*) FILTER (WHERE event_type = 'delete_cancelled') AS cancelados,
  ROUND(
    COUNT(*) FILTER (WHERE event_type = 'delete_cancelled')::numeric /
    NULLIF(COUNT(*) FILTER (WHERE event_type = 'delete_attempt'), 0) * 100,
    2
  ) AS porcentaje_cancelados
FROM analytics_events
WHERE timestamp >= NOW() - INTERVAL '7 days';
```

---

## 7. Alertas Automáticas

**Configurar en Supabase (Database Webhooks):**

### 7.1 Alerta de Incidente View As

```sql
-- Trigger function
CREATE OR REPLACE FUNCTION alert_view_as_incident()
RETURNS TRIGGER AS $$
BEGIN
  -- Si hay un delete_confirmed en modo View As, enviar alerta
  IF NEW.event_type = 'delete_confirmed'
     AND NEW.viewing_as_user_id IS NOT NULL THEN

    -- Log crítico
    INSERT INTO system_alerts (
      alert_type,
      severity,
      message,
      user_id,
      event_data
    ) VALUES (
      'view_as_delete',
      'CRITICAL',
      'Delete ejecutado en modo View As',
      NEW.user_id,
      NEW.event_data
    );

    -- TODO: Enviar email a CTO
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_alert_view_as_incident
AFTER INSERT ON analytics_events
FOR EACH ROW
EXECUTE FUNCTION alert_view_as_incident();
```

---

### 7.2 Alerta de Adopción Baja

```sql
-- Query diaria (ejecutar con cron job)
WITH daily_stats AS (
  SELECT
    COUNT(DISTINCT user_id) AS usuarios_activos_hoy
  FROM analytics_events
  WHERE timestamp >= CURRENT_DATE
)
SELECT
  CASE
    WHEN usuarios_activos_hoy < 30 THEN
      '⚠️ ALERTA: Solo ' || usuarios_activos_hoy || ' usuarios activos hoy (TARGET: >30)'
    ELSE
      '✅ Adopción normal: ' || usuarios_activos_hoy || ' usuarios activos'
  END AS status
FROM daily_stats;
```

---

## 8. Exportar Dashboard a CSV

**Para análisis en Excel/Google Sheets:**

```sql
-- Export métricas generales
COPY (
  SELECT
    'Sprint 1' AS sprint,
    COUNT(*) FILTER (WHERE event_type = 'view_as_enter') AS view_as_entries,
    COUNT(*) FILTER (WHERE event_type = 'delete_attempt') AS delete_attempts,
    COUNT(*) FILTER (WHERE event_type = 'delete_cancelled') AS delete_cancelled,
    COUNT(DISTINCT user_id) AS unique_users
  FROM analytics_events
  WHERE timestamp >= '2025-09-30'
    AND timestamp < '2025-10-07'
) TO '/tmp/sprint1_metrics.csv' WITH CSV HEADER;
```

---

## 9. Checklist de Revisión Diaria (CTO)

**Revisar cada día durante Sprint 1:**

- [ ] ¿Progreso según plan? (ver Dashboard 2.3)
- [ ] ¿Nuevos bugs críticos? (ver sistema de issues)
- [ ] ¿Algún blocker? (preguntar al equipo)
- [ ] ¿Incidentes View As? (query 6.1)
- [ ] ¿Usuarios beta satisfechos? (feedback directo)

**Revisar cada semana durante Sprint 2+:**

- [ ] ¿Score Lighthouse mejoró? (ejecutar `npm run lighthouse`)
- [ ] ¿Adopción >80%? (query 6.2)
- [ ] ¿NPS >60? (encuesta trimestral)
- [ ] ¿Tickets soporte <5? (revisar sistema de support)

---

**Documento mantenido por:** Product Manager Agent
**Última actualización:** 2025-09-30
**Próxima revisión:** 2025-10-07 (post-Sprint 1)

---

## Anexo: Dashboard en Notion/Jira

**Template para copiar:**

```markdown
# Nevent UX Improvements Tracker

## Sprint 1: Security Hardening
- [ ] Task 1: Confirmaciones destructivas (4h)
- [ ] Task 2: Banner View As mejorado (2h)
- [ ] Task 3: Overlay visual View As (3h)
- [ ] Task 4: Analytics básico (2h)

**Progress:** 0/4 ▱▱▱▱▱▱▱▱▱▱ 0%

## Sprint 2: UX Polish
- [ ] Task 5: Focus visible global (2h)
- [ ] Task 6: Loading states (5h)
- [ ] Task 7: Búsqueda dropdown View As (6h)
- [ ] Task 8: Tooltips explicativos (4h)
- [ ] Task 9: Contraste WCAG AA (5h)
- [ ] Task 10: Tests E2E Playwright (4h)

**Progress:** 0/6 ▱▱▱▱▱▱▱▱▱▱ 0%

## Métricas Clave
- Incidentes View As: 0 ✅
- Score A11y: 78/100 → TARGET: 85/100
- Adopción: N/A → TARGET: >80%
- NPS: N/A → TARGET: >60

## Alertas
Ninguna.

## Próxima Revisión
📅 2025-10-07
```