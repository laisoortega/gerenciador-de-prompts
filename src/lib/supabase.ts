import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log warning if keys are missing (only in dev)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found in env. App is running in Mock Mode.');
}

// Create client only if keys exist, otherwise return null (or a mock-safe proxy if we wanted to be fancy)
// For now, services should check if supabase is defined before using it.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
