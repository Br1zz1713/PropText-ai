-- ⚠️ DANGER ZONE: This script deletes ALL users and their associated data!
-- execute this in your Supabase Dashboard > SQL Editor

-- 1. Delete all users from the Auth system.
-- This usually cascades to 'public.profiles', 'public.listings', 'public.generations'
-- because of the "ON DELETE CASCADE" foreign keys.
DELETE FROM auth.users;

-- 2. Explicitly truncate public tables just to be absolutely sure everything is gone.
TRUNCATE TABLE public.generations CASCADE;
TRUNCATE TABLE public.listings CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 3. (Optional) If you want to delete specific users, use:
-- DELETE FROM auth.users WHERE email = 'you@example.com';
