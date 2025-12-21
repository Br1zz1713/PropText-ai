-- Seed Mock Listings Data
-- Run this in Supabase SQL Editor to populate "My Listings" with premium content

DO $$ 
DECLARE 
    current_user_id uuid;
BEGIN
    -- Get the ID of the specific user (change email if needed, or uses current auth context if running as user)
    -- This fallback gets the most recent user if auth.uid() is null in this context
    SELECT id INTO current_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    -- Or use auth.uid() if running in context (uncomment below if running as RLS)
    -- current_user_id := auth.uid();

    IF current_user_id IS NOT NULL THEN
        INSERT INTO public.listings (user_id, title, description, property_type, location, created_at)
        VALUES 
        (
            current_user_id,
            'Modern Villa in Ibiza', 
            'Stunning 500sqm villa with infinity pool, panoramic sea views, and smart home integration. Features 5 bedrooms, minimalist design, and private beach access.', 
            'Villa', 
            'Ibiza, Spain',
            NOW() - INTERVAL '2 days'
        ),
        (
            current_user_id,
            'Luxury Loft in Tribeca', 
            'Authentic industrial loft in the heart of Tribeca. Exposed brick walls, 12ft ceilings, and oversized windows. 120sqm of open concept living space.', 
            'Apartment', 
            'New York, NY',
            NOW() - INTERVAL '5 days'
        ),
        (
            current_user_id,
            'Seaside Apartment in Constanta', 
            'Bright and airy 2-bedroom apartment with balcony overlooking the Black Sea. Modern finishes, close to Mamaia beach and local amenities.', 
            'Apartment', 
            'Constanta, Romania',
            NOW() - INTERVAL '1 week'
        );
    END IF;
END $$;
