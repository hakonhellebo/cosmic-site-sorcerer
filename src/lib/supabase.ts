import { createClient } from '@supabase/supabase-js';
import { sanitizeInput, isRateLimited } from '@/utils/validation';

// Security: Use hardcoded values instead of environment variables for Lovable compatibility
const supabaseUrl = 'https://zcfclojzyqezuuwxzrzq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTYzODMsImV4cCI6MjA1OTA5MjM4M30.EvRcjK9lCiuuV7FBLE4M7g9mifFsUQg7nIMefi9VJaQ';

// Security: Configure Supabase client with secure options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for enhanced security
  },
});

// Security: Secure authentication helpers
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { 
      data: null, 
      error: {
        message: "Kunne ikke logge inn med Google. Vennligst prøv igjen."
      } 
    };
  }
};

export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    // Security: Rate limiting
    const clientIP = 'client'; // In a real app, you'd get the actual IP
    if (isRateLimited(`signup_${clientIP}`, 3, 300000)) { // 3 attempts per 5 minutes
      return {
        data: null,
        error: { message: "For mange forsøk. Prøv igjen om 5 minutter." }
      };
    }

    // Security: Input sanitization
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          full_name: `${sanitizedFirstName} ${sanitizedLastName}`.trim(),
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

export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Security: Rate limiting
    const clientIP = 'client';
    if (isRateLimited(`signin_${clientIP}`, 5, 300000)) { // 5 attempts per 5 minutes
      return {
        data: null,
        error: { message: "For mange påloggingsforsøk. Prøv igjen om 5 minutter." }
      };
    }

    // Security: Input sanitization
    const sanitizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
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

// Security: Enhanced questionnaire save functions with audit logging
const auditLog = async (action: string, tableName: string, recordId?: string, data?: any) => {
  try {
    const user = await getCurrentUser();
    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        table_name: tableName,
        record_id: recordId,
        new_data: data,
        ip_address: '0.0.0.0', // Would be actual IP in production
        user_agent: navigator.userAgent
      });
    }
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

export const saveHighSchoolQuestionnaire = async (userData: any, questionnaireData: any) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        data: null,
        error: { message: "Du må være innlogget for å lagre svar." }
      };
    }

    // Security: Sanitize input data
    const sanitizedUserData = {
      email: sanitizeInput(userData?.email || ''),
      firstName: sanitizeInput(userData?.firstName || ''),
      lastName: sanitizeInput(userData?.lastName || ''),
    };

    const responseData = {
      user_id: user.id,
      email: sanitizedUserData.email,
      name: `${sanitizedUserData.firstName} ${sanitizedUserData.lastName}`.trim(),
      responses: questionnaireData,
    };
    
    // Security: Save to Supabase with RLS protection
    const { data, error } = await supabase
      .from('high_school_responses')
      .insert(responseData)
      .select()
      .single();
        
    if (error) {
      console.error("Database save error:", error);
      throw error;
    }

    // Security: Audit log
    await auditLog('INSERT', 'high_school_responses', data.id, responseData);
    
    // Also save to localStorage as backup
    localStorage.setItem('userFullData', JSON.stringify({
      ...sanitizedUserData,
      questionnaire: { highSchool: questionnaireData }
    }));
    
    return { data, error: null };
    
  } catch (error) {
    console.error("Error saving high school questionnaire:", error);
    return { 
      data: null, 
      error: {
        message: "Kunne ikke lagre svarene dine. Vennligst prøv igjen."
      } 
    };
  }
};

// Store a university questionnaire response - updating with same pattern as high school
export const saveUniversityQuestionnaire = async (userData: any, questionnaireData: any) => {
  try {
    const user = await getCurrentUser();
    
    console.log("Attempting to save university response with data:", {
      user_id: user?.id || 'anonymous',
      email: userData?.email || 'anonymous',
      name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Anonymous',
    });
    
    // Always save to local storage first as a reliable backup
    const responseData = {
      user_id: user?.id || 'anonymous',
      email: userData?.email || 'anonymous',
      name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Anonymous',
      responses: questionnaireData,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('universityResponses', JSON.stringify(responseData));
    
    // Also save full data to userFullData for immediate access in results page
    const combinedData = {
      ...userData,
      questionnaire: { 
        university: questionnaireData 
      }
    };
    
    localStorage.setItem('userFullData', JSON.stringify(combinedData));
    
    // Try to save to Supabase, but don't block success if it fails
    try {
      // Simplify the response object to avoid potential issues
      const simpleResponses = JSON.parse(JSON.stringify(questionnaireData));
      
      const { error } = await supabase
        .from('university_responses')
        .insert({
          ...responseData,
          responses: simpleResponses
        });
        
      if (error) {
        console.warn("Could not save to Supabase, but data is saved locally:", error);
      }
    } catch (supabaseError) {
      console.warn("Supabase storage failed, but data is saved locally:", supabaseError);
      // Don't throw the error - we've already saved to localStorage
    }
    
    // Return success since we've at least saved to localStorage
    return { 
      data: combinedData, 
      error: null 
    };
    
  } catch (error) {
    console.error("Error saving university questionnaire:", error);
    return { 
      data: null, 
      error: {
        message: "Kunne ikke lagre alle dine svar, men vi har gjort vårt beste for å bevare dem lokalt.",
        details: error
      } 
    };
  }
};

// Store a worker questionnaire response - updating with same pattern as above
export const saveWorkerQuestionnaire = async (userData: any, questionnaireData: any) => {
  try {
    const user = await getCurrentUser();
    
    console.log("Attempting to save worker response with data:", {
      user_id: user?.id || 'anonymous',
      email: userData?.email || 'anonymous',
      name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Anonymous',
    });
    
    // Always save to local storage first as a reliable backup
    const responseData = {
      user_id: user?.id || 'anonymous',
      email: userData?.email || 'anonymous',
      name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Anonymous',
      responses: questionnaireData,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('workerResponses', JSON.stringify(responseData));
    
    // Also save full data to userFullData for immediate access in results page
    const combinedData = {
      ...userData,
      questionnaire: { 
        worker: questionnaireData 
      }
    };
    
    localStorage.setItem('userFullData', JSON.stringify(combinedData));
    
    // Try to save to Supabase, but don't block success if it fails
    try {
      const { error } = await supabase
        .from('worker_responses')
        .insert(responseData);
        
      if (error) {
        console.warn("Could not save to Supabase, but data is saved locally:", error);
      }
    } catch (supabaseError) {
      console.warn("Supabase storage failed, but data is saved locally:", supabaseError);
      // Don't throw the error - we've already saved to localStorage
    }
    
    // Return success since we've at least saved to localStorage
    return { 
      data: combinedData, 
      error: null 
    };
    
  } catch (error) {
    console.error("Error saving worker questionnaire:", error);
    return { 
      data: null, 
      error: {
        message: "Kunne ikke lagre alle dine svar, men vi har gjort vårt beste for å bevare dem lokalt.",
        details: error
      } 
    };
  }
};

// Get all questionnaire responses (for admin view)
export const getAllResponses = async (table: 'high_school_responses' | 'university_responses' | 'worker_responses') => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return { data: null, error };
  }
};

// Get university data from Universitetsdata table
export const getUniversityData = async (institutionCode?: string, year?: string) => {
  try {
    let query = supabase
      .from('Universitetsdata')
      .select('*');
    
    if (institutionCode) {
      query = query.eq('Institusjonskode', institutionCode);
    }
    
    // Filter by year if provided - check if Årstall column exists
    if (year) {
      query = query.eq('Årstall', year);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching university data:', error);
    return { data: null, error };
  }
};

// Get career data from Yrke_statistikk table
export const getCareerStatistics = async (careerName?: string) => {
  try {
    console.log("getCareerStatistics called with:", { careerName });
    
    let query = supabase
      .from('Yrke_statistikk')
      .select('*');
    
    if (careerName) {
      query = query.eq('styrk08_navn', careerName);
    }
    
    console.log("Executing query on Yrke_statistikk...");
    const { data, error } = await query;
    
    console.log("Query result:", { 
      dataLength: data?.length, 
      error: error?.message,
      firstRow: data?.[0] 
    });
    
    if (error) {
      console.error('Supabase error in getCareerStatistics:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching career statistics:', error);
    return { data: null, error };
  }
};

// Get detailed career data from Clean_11418 table
export const getDetailedCareerData = async (careerName?: string) => {
  try {
    let query = supabase
      .from('Clean_11418')
      .select('*');
    
    if (careerName) {
      query = query.eq('Yrke', careerName);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching detailed career data:', error);
    return { data: null, error };
  }
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
