-- FIX: Add missing columns for new features
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS property_details jsonb;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS agency_name text,
ADD COLUMN IF NOT EXISTS phone_number text;

-- EXISTING POLICIES BELOW...
-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Profiles: Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Profiles: Allow users to insert their own profile (useful for triggers/client-side creation)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Profiles: Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Listings: Allow users to view their own listings
CREATE POLICY "Users can view own listings" 
ON listings FOR SELECT 
USING (auth.uid() = user_id);

-- Listings: Allow users to insert their own listings
CREATE POLICY "Users can insert own listings" 
ON listings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Billings/Generations if they exist
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own generations" 
ON generations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" 
ON generations FOR INSERT 
WITH CHECK (auth.uid() = user_id);
