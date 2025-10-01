-- ================================================================
-- CREAR USUARIO CMO - Quick Setup
-- ================================================================
-- Ejecutar en Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg/sql/new

-- ================================================================
-- OPCIÓN 1: Actualizar usuario existente
-- ================================================================
-- Reemplaza 'tu_email@ejemplo.com' con tu email real

UPDATE users
SET role = 'cmo'
WHERE email = 'tu_email@ejemplo.com';

-- Verificar que se actualizó correctamente
SELECT id, email, full_name, role
FROM users
WHERE role = 'cmo';

-- ================================================================
-- OPCIÓN 2: Crear nuevo usuario CMO desde cero
-- ================================================================
-- Solo si no tienes usuario y quieres crear uno nuevo

INSERT INTO users (
  id,
  email,
  full_name,
  role,
  avatar_url,
  created_at
)
VALUES (
  gen_random_uuid(),
  'cmo@nevent.com',
  'Chief Marketing Officer',
  'cmo',
  'https://ui-avatars.com/api/?name=CMO&background=9C27B0&color=fff',
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET role = 'cmo';

-- ================================================================
-- VERIFICACIÓN: Ver todos los CMOs
-- ================================================================
SELECT
  id,
  email,
  full_name,
  role,
  created_at
FROM users
WHERE role = 'cmo'
ORDER BY created_at DESC;

-- ================================================================
-- BONUS: Ver estructura de permisos completa
-- ================================================================
SELECT
  role,
  COUNT(*) as total_users
FROM users
GROUP BY role
ORDER BY
  CASE role
    WHEN 'ceo' THEN 1
    WHEN 'cmo' THEN 2
    WHEN 'director' THEN 3
    WHEN 'csm' THEN 4
    WHEN 'user' THEN 5
    ELSE 99
  END;

-- ================================================================
-- RESULTADO ESPERADO:
-- ================================================================
-- Deberías ver al menos 1 usuario con role = 'cmo'
-- Después de ejecutar, recarga la app y haz login con ese usuario
-- Verás: CMO Dashboard, Marketing, Customer Success tabs
