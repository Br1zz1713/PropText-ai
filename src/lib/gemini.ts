/**
 * Google Gemini AI Client Configuration
 * 
 * This module initializes the Google Generative AI client for creating
 * AI-powered property listing descriptions.
 * 
 * @requires GOOGLE_GEMINI_API_KEY - Environment variable for API authentication
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY!;

/**
 * Initialized Google Generative AI client instance
 * Used for accessing Google's AI models
 */
export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Pre-configured Gemini 1.5 Flash model instance
 * 
 * This model is optimized for fast, cost-effective text generation.
 * Used as the primary model for generating property listings.
 * 
 * @see /api/generate for usage with fallback logic
 */
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
