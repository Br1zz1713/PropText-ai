/**
 * Supabase Client Configuration (Client-Side)
 * 
 * This module creates a Supabase client for client-side operations.
 * For server-side operations, use @/utils/supabase/server instead.
 * 
 * @requires NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL
 * @requires NEXT_PUBLIC_SUPABASE_ANON_KEY - Public anonymous key for client-side auth
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client-side Supabase instance
 * 
 * Used for:
 * - User authentication (login, signup, logout)
 * - Real-time subscriptions
 * - Client-side data fetching with RLS
 * 
 * @see /utils/supabase/server for server-side operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
