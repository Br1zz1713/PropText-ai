import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS class names intelligently
 * 
 * This utility function combines clsx (for conditional classes) with
 * tailwind-merge (to resolve conflicting Tailwind classes).
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays)
 * @returns Merged and deduplicated class string
 * 
 * @example
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': true })
 * // Returns: 'px-4 py-2 bg-blue-500 text-white'
 * 
 * @example
 * cn('px-4', 'px-8') // Conflicting classes
 * // Returns: 'px-8' (later class wins)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Gets the base site URL for the application
 * 
 * Determines the correct base URL based on environment:
 * 1. NEXT_PUBLIC_SITE_URL (manually set in production)
 * 2. NEXT_PUBLIC_VERCEL_URL (auto-set by Vercel)
 * 3. http://localhost:3000 (development fallback)
 * 
 * Automatically adds https:// protocol and removes trailing slashes.
 * 
 * @returns Normalized base URL without trailing slash
 * 
 * @example
 * getSiteUrl() // Returns: 'https://proptext.ai'
 */
export function getSiteUrl() {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        'http://localhost:3000';

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to remove trailing `/`.
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    return url;
}

/**
 * Converts a relative path to an absolute URL
 * 
 * Combines the base site URL with a relative path to create
 * a fully qualified URL. Useful for:
 * - Email links
 * - Webhook URLs
 * - Redirect URLs
 * - Meta tags (og:url, canonical)
 * 
 * @param path - Relative path starting with / (e.g., '/dashboard', '/api/webhooks')
 * @returns Absolute URL
 * 
 * @example
 * absoluteUrl('/dashboard')
 * // Returns: 'https://proptext.ai/dashboard'
 */
export function absoluteUrl(path: string) {
    return `${getSiteUrl()}${path}`;
}
