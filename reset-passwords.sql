-- ================================================================
-- RESET TEST USER PASSWORDS
-- Run this in Supabase SQL Editor if login fails
-- ================================================================

-- Note: You cannot update passwords via SQL directly
-- You must use the Supabase Dashboard: Authentication → Users

-- To reset passwords:
-- 1. Go to: https://supabase.com/dashboard/project/tvbqzqripcevaryquhfg/auth/users
-- 2. For each user (ceo@nevent.es, director@nevent.es, csm@nevent.es, user@nevent.es):
--    - Click on the user
--    - Click "Reset Password"
--    - Set new password: Test1234!
--    - Click "Update user"

-- Alternative: Delete and recreate users
-- DELETE FROM auth.users WHERE email LIKE '%@nevent.es';

-- Then recreate via Dashboard → Authentication → Users → Add User:
-- Email: ceo@nevent.es, Password: Test1234!, Auto Confirm: YES
-- Email: director@nevent.es, Password: Test1234!, Auto Confirm: YES
-- Email: csm@nevent.es, Password: Test1234!, Auto Confirm: YES
-- Email: user@nevent.es, Password: Test1234!, Auto Confirm: YES

-- Verify users exist:
SELECT id, email, role, created_at
FROM public.users
WHERE email LIKE '%@nevent.es'
ORDER BY email;
