-- ==========================================
-- PropText.ai - Complete Database Setup Script (Fixed)
-- ==========================================

-- 1. CLEANUP (Optional - Uncomment if you want to fresh start)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP TABLE IF EXISTS public.generations;
-- DROP TABLE IF EXISTS public.listings;
-- DROP TABLE IF EXISTS public.profiles;

-- ==========================================
-- 2. TABLES SETUP & MIGRATIONS
-- ==========================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  credits_remaining INTEGER DEFAULT 3 CHECK (credits_remaining >= 0)
);

-- Explicitly add columns (Safe if table already exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;


-- LISTINGS
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  property_type TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Explicitly add columns
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS property_details JSONB;


-- GENERATIONS (Usage History)
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    input_data JSONB,
    output_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. AUTOMATION (Triggers)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, credits_remaining, subscription_status)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    3,       -- Give 3 credits by default
    'free'   -- Default to free plan
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 4. SECURITY (RLS Policies)
-- ==========================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for owner" ON public.listings;
DROP POLICY IF EXISTS "Users can view own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can manage own listings" ON public.listings; -- In case it was created with this name
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON public.generations;

-- PROFILES Policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- LISTINGS Policies
CREATE POLICY "Users can manage own listings" 
ON public.listings FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- GENERATIONS Policies
CREATE POLICY "Users can view own generations" 
ON public.generations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" 
ON public.generations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. MIGRATION / DATA FIXES
-- ==========================================

-- Ensure existing users have defaults
UPDATE public.profiles 
SET credits_remaining = 3 
WHERE credits_remaining IS NULL OR credits_remaining = 0;

UPDATE public.profiles
SET subscription_status = 'free'
WHERE subscription_status IS NULL;
