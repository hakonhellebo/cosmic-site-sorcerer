
import { sanitizeInput } from '@/utils/validation';

// Security: API endpoint configuration with validation
const API_ENDPOINTS = {
  EDPATH_API: 'https://edpathapi-f4959a84e89e.herokuapp.com',
} as const;

// Security: Request validation and sanitization
export const makeSecureApiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  data?: any
) => {
  try {
    // Security: Validate endpoint
    const url = new URL(endpoint);
    if (!Object.values(API_ENDPOINTS).some(validEndpoint => 
      url.origin === new URL(validEndpoint).origin
    )) {
      throw new Error('Invalid API endpoint');
    }

    // Security: Sanitize request data
    let sanitizedData = data;
    if (data && typeof data === 'object') {
      sanitizedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === 'string' ? sanitizeInput(value) : value
        ])
      );
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: sanitizedData ? JSON.stringify(sanitizedData) : options.body,
    };

    const response = await fetch(endpoint, requestOptions);
    
    if (!response.ok) {
      // Security: Don't expose detailed error information
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw new Error('En feil oppstod ved kommunikasjon med serveren');
  }
};

// Security: Specific API functions with validation
export const submitToEdPathApi = async (answers: Record<string, number>) => {
  try {
    // Security: Validate input structure
    if (!answers || typeof answers !== 'object') {
      throw new Error('Invalid answers format');
    }

    // Security: Validate answer values
    const validatedAnswers = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => {
        if (typeof value !== 'number' || value < 0 || value > 10) {
          throw new Error(`Invalid answer value for ${key}`);
        }
        return [sanitizeInput(key), value];
      })
    );

    const response = await makeSecureApiRequest(
      `${API_ENDPOINTS.EDPATH_API}/predict`,
      {
        method: 'POST',
      },
      validatedAnswers
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('EdPath API error:', error);
    throw new Error('Kunne ikke hente anbefalinger. Vennligst prøv igjen.');
  }
};
