# 🧪 Test Users - Usuarios de Prueba

Este documento explica cómo crear usuarios de prueba para cada rol en la aplicación.

## 📋 Roles Disponibles

La aplicación tiene 4 roles diferentes:

1. **user** - Usuario regular (empleado)
2. **director** - Director de departamento
3. **ceo** - CEO (acceso completo)
4. **csm** - Customer Success Manager

## 🚀 Instrucciones para Crear Usuarios

### Paso 1: Ejecutar Script SQL

Ve a tu proyecto de Supabase y ejecuta el siguiente SQL:

**Opción A: Supabase Dashboard**
1. Abre tu proyecto en https://supabase.com
2. Ve a: **SQL Editor** → **New Query**
3. Copia y pega el contenido de `migrations/create_test_users.sql`
4. Ejecuta el script (esto creará la tabla `public.users` y el trigger)

### Paso 2: Crear Usuarios en Supabase Auth

**Opción B: Via Dashboard (Recomendado)**
1. Ve a: **Authentication** → **Users** → **Add User**
2. Crea cada usuario con los siguientes datos:

| Email | Password | Auto Confirm |
|-------|----------|--------------|
| `user@nevent.es` | `Test1234!` | ✅ YES |
| `director@nevent.es` | `Test1234!` | ✅ YES |
| `ceo@nevent.es` | `Test1234!` | ✅ YES |
| `csm@nevent.es` | `Test1234!` | ✅ YES |

⚠️ **IMPORTANTE**: Marca "Auto Confirm User" para cada usuario

### Paso 3: Verificar Trigger Automático

El trigger `on_auth_user_created` debería crear automáticamente los perfiles en `public.users` con los roles correctos basándose en el email.

Verifica ejecutando:

```sql
SELECT
  u.id,
  u.email,
  pu.role,
  pu.full_name,
  pu.department_id
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
WHERE u.email LIKE '%@nevent.es'
ORDER BY u.email;
```

### Paso 4 (Opcional): Asignar Roles Manualmente

Si el trigger no funcionó, ejecuta esto:

```sql
-- Obtener los IDs de los usuarios
SELECT id, email FROM auth.users
WHERE email IN ('user@nevent.es', 'director@nevent.es', 'ceo@nevent.es', 'csm@nevent.es');

-- Insertar/actualizar perfiles manualmente
INSERT INTO public.users (id, email, full_name, role, department_id) VALUES
  ('[UUID de user@nevent.es]', 'user@nevent.es', 'Usuario Test', 'user', NULL),
  ('[UUID de director@nevent.es]', 'director@nevent.es', 'Director Test', 'director', 'dept-marketing'),
  ('[UUID de ceo@nevent.es]', 'ceo@nevent.es', 'CEO Test', 'ceo', NULL),
  ('[UUID de csm@nevent.es]', 'csm@nevent.es', 'CSM Test', 'csm', 'dept-customer-success')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  department_id = EXCLUDED.department_id;
```

## 🧪 Probar los Roles

### 1. User Role (`user@nevent.es`)
**Acceso:**
- ✅ Timeline View
- ✅ Mi Dashboard (User OKRs + Initiatives)
- ❌ CEO Dashboard
- ❌ Director Dashboard
- ❌ Customer Success Dashboard

**Qué puede ver:**
- Sus propios OKRs y acciones
- Sus initiatives vinculadas
- Estadísticas personales

---

### 2. Director Role (`director@nevent.es`)
**Acceso:**
- ✅ Timeline View
- ✅ Mi Dashboard
- ✅ Director Dashboard
- ❌ CEO Dashboard
- ❌ Customer Success Dashboard

**Qué puede ver:**
- Todo lo de User +
- Dashboard de su departamento (Marketing)
- OKRs de su equipo
- Budget tracking del departamento
- Team members grid

---

### 3. CEO Role (`ceo@nevent.es`)
**Acceso:**
- ✅ Timeline View
- ✅ Mi Dashboard
- ✅ CEO Dashboard (exclusivo)
- ✅ Director Dashboard (hereda)
- ✅ Customer Success Dashboard (hereda)

**Qué puede ver:**
- **TODO**: Acceso completo a todas las vistas
- CEO Dashboard con:
  - Company Health, OKR Completion, Active Initiatives, Budget
  - Company OKRs con progress bars
  - Department Health Grid (7 departamentos)
- Puede crear Company OKRs

---

### 4. CSM Role (`csm@nevent.es`)
**Acceso:**
- ✅ Timeline View
- ✅ Mi Dashboard
- ✅ Customer Success Dashboard
- ❌ CEO Dashboard
- ❌ Director Dashboard

**Qué puede ver:**
- Todo lo de User +
- CS Dashboard con:
  - Total Customers, MRR, Health Score, Onboarding Rate
  - NRR & Churn Rate calculations
  - Customer segmentation (All/Active/At Risk/Churned)
  - Customer list con CRUD
  - OKR Contribution Banner
  - Sync button para Company OKRs

---

## 🔐 Credenciales de Prueba

**Todos los usuarios tienen la misma contraseña para facilitar testing:**

```
Password: Test1234!
```

| Role | Email | Password |
|------|-------|----------|
| User | `user@nevent.es` | `Test1234!` |
| Director | `director@nevent.es` | `Test1234!` |
| CEO | `ceo@nevent.es` | `Test1234!` |
| CSM | `csm@nevent.es` | `Test1234!` |

## 🐛 Troubleshooting

### Problema: "User does not exist" al hacer login

**Solución:**
1. Verifica que el usuario exista en `auth.users`
2. Verifica que tenga `email_confirmed_at` no NULL
3. En Supabase Dashboard, ve a Authentication → Users y confirma manualmente

### Problema: Usuario se loguea pero no tiene el rol correcto

**Solución:**
1. Verifica que exista en `public.users`:
   ```sql
   SELECT * FROM public.users WHERE email = 'user@nevent.es';
   ```
2. Si no existe, ejecuta el INSERT manual del Paso 4
3. Haz logout y vuelve a hacer login

### Problema: "Permission denied" al cargar datos

**Solución:**
1. Verifica que las RLS policies estén correctas en `migrations/v3.0.0_rls.sql`
2. Ejecuta:
   ```sql
   -- Ver policies activas
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

## 📊 Estructura de Datos

La tabla `public.users` tiene esta estructura:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'director', 'ceo', 'csm')),
  department_id TEXT REFERENCES departments(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎯 Siguientes Pasos

1. Crear más usuarios de prueba con diferentes departamentos
2. Asignar OKRs a cada usuario
3. Crear customers de prueba para CSM
4. Vincular initiatives a OKRs

---

**Última actualización:** 2025-09-30
**Mantenido por:** fran.ferrer@nevent.es