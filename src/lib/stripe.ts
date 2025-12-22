/**
 * Stripe Payment Processing Client
 * 
 * This module initializes the Stripe client for handling:
 * - Subscription checkout sessions
 * - Payment webhooks
 * - Customer management
 * 
 * @requires STRIPE_SECRET_KEY - Server-side Stripe secret key (sk_test_* or sk_live_*)
 */
import Stripe from 'stripe';

/**
 * Initialized Stripe client instance
 * 
 * Configuration:
 * - API Version: 2023-10-16 (stable)
 * - TypeScript: Enabled for type safety
 * 
 * @see /api/checkout for checkout session creation
 * @see /api/webhooks/stripe for webhook handling
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
    typescript: true,
});
