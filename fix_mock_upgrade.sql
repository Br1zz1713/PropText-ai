-- 1. Add missing specific columns for Mock functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';

-- 2. Ensure RLS allows updates
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing to avoid conflicts/duplicates if names match
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Re-create the update policy
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Ensure generations table exists (for usage history)
CREATE TABLE IF NOT EXISTS public.generations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    input_data jsonb,
    output_text text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
CREATE POLICY "Users can view own generations" ON public.generations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own generations" ON public.generations;
CREATE POLICY "Users can insert own generations" ON public.generations FOR INSERT WITH CHECK (auth.uid() = user_id);
