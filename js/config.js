/**
 * Application Configuration
 *
 * Set your Supabase credentials here or load them from your deployment environment.
 *
 * SECURITY NOTE:
 * - For local development, you can hardcode values here temporarily
 * - For production, use environment variables or your hosting platform's secrets management
 * - Never commit real credentials to version control
 */

// Option 1: Set credentials directly (for testing only)
window.SUPABASE_URL = 'https://efztfdoezylxvzwqgudk.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenRmZG9lenlseHZ6d3FndWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjEyNTYsImV4cCI6MjA3ODAzNzI1Nn0.wlckOav0Ta5cG6S1DWMbLTBV0xe0Mj0clhDV8xBeB7o';

// Option 2: Load from deployment environment (recommended for production)
// When deploying to platforms like Netlify, Vercel, or similar:
// These platforms can inject environment variables at build time
// Example for Netlify/Vercel:
// window.SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// window.SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * HOW TO GET YOUR SUPABASE CREDENTIALS:
 *
 * 1. Go to https://supabase.com
 * 2. Create a new project (or select existing)
 * 3. Go to Project Settings > API
 * 4. Copy:
 *    - Project URL (looks like: https://xxxxx.supabase.co)
 *    - anon/public key (starts with: eyJ...)
 * 5. Replace the placeholder values above
 */
