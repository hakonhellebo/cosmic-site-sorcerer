
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the required environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please check your Supabase project settings and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// Create a dummy or real Supabase client based on available credentials
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  // Create a mock client that won't crash but will log errors when used
  : {
      auth: {
        signUp: () => {
          console.error('Supabase is not configured. Please set environment variables.');
          return Promise.resolve({ error: { message: 'Supabase is not configured' }, data: null });
        },
        signInWithPassword: () => {
          console.error('Supabase is not configured. Please set environment variables.');
          return Promise.resolve({ error: { message: 'Supabase is not configured' }, data: null });
        },
        getSession: () => {
          console.error('Supabase is not configured. Please set environment variables.');
          return Promise.resolve({ error: { message: 'Supabase is not configured' }, data: { session: null } });
        },
        signOut: () => {
          console.error('Supabase is not configured. Please set environment variables.');
          return Promise.resolve({ error: null });
        },
        resend: () => {
          console.error('Supabase is not configured. Please set environment variables.');
          return Promise.resolve({ error: { message: 'Supabase is not configured' } });
        }
      }
    };
