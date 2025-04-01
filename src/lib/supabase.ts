
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use provided project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zcfclojzyqezuuwxzrzq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTYzODMsImV4cCI6MjA1OTA5MjM4M30.EvRcjK9lCiuuV7FBLE4M7g9mifFsUQg7nIMefi9VJaQ';

// Check if we have at least the URL and warn if anon key is missing
if (!supabaseAnonKey) {
  console.warn(
    'Missing Supabase anon key. Please check your Supabase project settings and set VITE_SUPABASE_ANON_KEY.'
  );
}

// Create a Supabase client with the available credentials
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Helper function for email sign-up (without verification)
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        // Disable email verification
        data: {
          email_confirmed: true
        }
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error("Email sign-up error:", error);
    return { 
      data: null, 
      error: {
        message: "Kunne ikke registrere bruker. Vennligst prøv igjen."
      } 
    };
  }
};

// Helper function for email sign-in
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  } catch (error) {
    console.error("Email sign-in error:", error);
    return { 
      data: null, 
      error: {
        message: "Kunne ikke logge inn. Sjekk e-post og passord og prøv igjen."
      } 
    };
  }
};

// Helper function to get the current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper function to check auth state
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function for sign-out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
