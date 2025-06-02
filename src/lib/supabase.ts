
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use provided project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zcfclojzyqezuuwxzrzq.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTYzODMsImV4cCI6MjA1OTA5MjM4M30.EvRcjK9lCiuuV7FBLE4M7g9mifFsUQg7nIMefi9VJaQ';

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

// Helper function for Google sign-in
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
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

// Helper function to create tables if they don't exist
const ensureTablesExist = async () => {
  try {
    // First check if high_school_responses table exists
    const { error: checkHighSchoolError } = await supabase
      .from('high_school_responses')
      .select('id')
      .limit(1)
      .throwOnError();
      
    if (checkHighSchoolError) {
      // If error happens, table likely doesn't exist, let's check more specifically
      console.log("High school responses table may not exist:", checkHighSchoolError);
    }
    
    // Check university_responses table
    const { error: checkUniversityError } = await supabase
      .from('university_responses')
      .select('id')
      .limit(1)
      .throwOnError();
      
    if (checkUniversityError) {
      console.log("University responses table may not exist:", checkUniversityError);
    }
    
    // Check worker_responses table
    const { error: checkWorkerError } = await supabase
      .from('worker_responses')
      .select('id')
      .limit(1)
      .throwOnError();
      
    if (checkWorkerError) {
      console.log("Worker responses table may not exist:", checkWorkerError);
    }
    
    return true;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  }
};

// Call ensure tables when this module loads
ensureTablesExist();

// Store a high school questionnaire response
export const saveHighSchoolQuestionnaire = async (userData: any, questionnaireData: any) => {
  try {
    const user = await getCurrentUser();
    
    console.log("Attempting to save high school response with data:", {
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
    localStorage.setItem('highSchoolResponses', JSON.stringify(responseData));
    
    // Also save full data to userFullData for immediate access in results page
    const combinedData = {
      ...userData,
      questionnaire: { 
        highSchool: questionnaireData 
      }
    };
    
    localStorage.setItem('userFullData', JSON.stringify(combinedData));
    
    // Try to save to Supabase, but don't block success if it fails
    try {
      const { error } = await supabase
        .from('high_school_responses')
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
    console.error("Error saving high school questionnaire:", error);
    // Return a more specific error but still allow the app to proceed
    return { 
      data: null, 
      error: {
        message: "Kunne ikke lagre alle dine svar, men vi har gjort vårt beste for å bevare dem lokalt.",
        details: error
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

// Updated function to get university data from Student_data table
export const getUniversityData = async (institutionCode?: string, year?: string) => {
  try {
    console.log("Fetching university data from Student_data table with params:", { institutionCode, year });
    
    let query = supabase
      .from('Student_data')
      .select('*', { count: 'exact' })
      .order('Lærestednavn', { ascending: true });
    
    // Note: institutionCode and year filters might need adjustment based on new data structure
    if (institutionCode) {
      // Since we don't have institution codes in the new structure, we might filter by Lærestednavn
      console.log("Institution code filtering not applicable with new data structure");
    }
    
    console.log("Executing query to fetch ALL university data from Student_data table...");
    
    // Fetch data in batches to handle large datasets
    let allData: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`Fetching batch starting from ${from} with size ${batchSize}`);
      
      const { data: batchData, error, count } = await query
        .range(from, from + batchSize - 1);
      
      if (error) {
        console.error("Supabase error in getUniversityData:", error);
        throw error;
      }
      
      if (batchData && batchData.length > 0) {
        allData = [...allData, ...batchData];
        console.log(`Added ${batchData.length} records. Total so far: ${allData.length}`);
        
        if (batchData.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
        
        if (count !== null && allData.length >= count) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }
    
    console.log("Student_data query complete:", { 
      totalRecords: allData.length,
      sampleData: allData.slice(0, 3)
    });
    
    // Transform the pivot data to match the expected format
    const transformedData = transformStudentDataToUniversityFormat(allData);
    
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching university data from Student_data:', error);
    return { data: null, error };
  }
};

// Helper function to transform Student_data pivot format to expected university data format
const transformStudentDataToUniversityFormat = (studentData: any[]) => {
  console.log("Transforming Student_data to university format...");
  
  // Group by study program
  const groupedData = studentData.reduce((acc, row) => {
    const key = `${row.Lærestednavn}-${row.Studiekode}`;
    
    if (!acc[key]) {
      acc[key] = {
        Institusjonsnavn: row.Lærestednavn,
        Institusjonskode: row.Studiekode?.split(' ')[0] || '',
        Studnavn: row.Studienavn,
        Studiumkode: row.Studiekode,
        Avdelingsnavn: row['Utdanningsområde- og type'] || '',
        Nivånavn: 'Bachelor\\, 3-årig', // Default value for compatibility
        Årstall: '2025', // Default value for compatibility
        Semester: 'Høst',
        measurements: {}
      };
    }
    
    // Store the measurement
    if (row['Measure Names'] && row['Measure Values']) {
      acc[key].measurements[row['Measure Names']] = row['Measure Values'];
    }
    
    return acc;
  }, {});
  
  const transformedData = Object.values(groupedData).map((item: any) => {
    return {
      ...item,
      // Add computed fields for compatibility with existing code
      snitt: parseFloat(item.measurements['Snitt']) || 0,
      planlagteStudieplasser: parseInt(item.measurements['Planlagte studieplasser']) || 0,
      sokereMott: parseInt(item.measurements['Søkere møtt']) || 0,
      sokereTilbud: parseInt(item.measurements['Søkere tilbud']) || 0,
      sokereTilbudJaSvar: parseInt(item.measurements['Søkere tilbud ja-svar']) || 0,
      sokereKvalifisert: parseInt(item.measurements['Søkere kvalifisert']) || 0,
      sokere: parseInt(item.measurements['Søkere']) || 0,
      sokerePerPlass: parseFloat(item.measurements['Søkere per plass']) || 0
    };
  });
  
  console.log("Transformation complete. Sample transformed data:", transformedData.slice(0, 2));
  return transformedData;
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
