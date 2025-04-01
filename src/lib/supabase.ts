
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use provided project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zcfclojzyqezuuwxzrzq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have at least the URL and warn if anon key is missing
if (!supabaseAnonKey) {
  console.warn(
    'Missing Supabase anon key. Please check your Supabase project settings and set VITE_SUPABASE_ANON_KEY.'
  );
}

// Create a Supabase client with the available credentials
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY3NjAzNDEsImV4cCI6MjAxMjMzNjM0MX0.DpODFHgr8LNYmG-lbmUYYIkKd80hkCr2716TP1QSsCs'
);
