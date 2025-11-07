/**
 * Supabase Configuration and Client Initialization
 *
 * This module initializes and exports the Supabase client for use across the application.
 * Make sure to set your environment variables before using this.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase project credentials
// IMPORTANT: Replace these with your actual Supabase project credentials
// For production, use environment variables or a secure config management system
const SUPABASE_URL = window.SUPABASE_URL || 'https://efztfdoezylxvzwqgudk.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenRmZG9lenlseHZ6d3FndWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjEyNTYsImV4cCI6MjA3ODAzNzI1Nn0.wlckOav0Ta5cG6S1DWMbLTBV0xe0Mj0clhDV8xBeB7o';

// Validate configuration
if (SUPABASE_URL === 'https://efztfdoezylxvzwqgudk.supabase.co' || SUPABASE_ANON_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenRmZG9lenlseHZ6d3FndWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjEyNTYsImV4cCI6MjA3ODAzNzI1Nn0.wlckOav0Ta5cG6S1DWMbLTBV0xe0Mj0clhDV8xBeB7o') {
    console.warn('⚠️ Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
}

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Submit contact form data to Supabase
 * @param {Object} formData - The form data to submit
 * @param {string} formData.name - Contact name
 * @param {string} formData.email - Contact email
 * @param {string} formData.organization - Organization name (optional)
 * @param {string} formData.message - Message content
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function submitContactForm(formData) {
    try {
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    organization: formData.organization || null,
                    message: formData.message,
                    status: 'new'
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            data: data
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        };
    }
}

/**
 * Fetch all contact submissions (for admin use)
 * @param {number} limit - Maximum number of submissions to fetch
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function getContactSubmissions(limit = 50) {
    try {
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            data: data
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

/**
 * Update submission status (for admin use)
 * @param {number} id - Submission ID
 * @param {string} status - New status ('new', 'read', 'responded')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateSubmissionStatus(id, status) {
    try {
        const { error } = await supabase
            .from('contact_submissions')
            .update({ status })
            .eq('id', id);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}
