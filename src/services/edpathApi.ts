
import { EdPathApiResponse, EdPathUserType, EdPathMappedAnswers } from './edpathApi.types';
import { getEdPathApiBaseUrl, isEdPathApiConfigured, EDPATH_ENDPOINTS } from './edpathApi.config';

export type { EdPathApiResponse } from './edpathApi.types';

/**
 * Send questionnaire answers to the EdPath matching API and get recommendations.
 *
 * @param answers - Mapped answers in the format the backend expects
 * @param userType - The type of user: 'elev', 'student', or 'arbeidstaker'
 * @returns Structured recommendations from the API
 * @throws Error with user-friendly message if the request fails
 */
export const getRecommendations = async (
  answers: EdPathMappedAnswers,
  userType: EdPathUserType
): Promise<EdPathApiResponse> => {
  if (!isEdPathApiConfigured()) {
    console.warn('EdPath API not configured — returning fallback empty response');
    throw new Error('EdPath API er ikke konfigurert. Kontakt administrator.');
  }

  const baseUrl = getEdPathApiBaseUrl();
  const endpoint = EDPATH_ENDPOINTS[userType];
  const url = `${baseUrl}${endpoint}`;

  console.log(`📤 Sending ${userType} answers to EdPath API:`, url);
  console.log('Payload:', { svar: answers });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ svar: answers }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ EdPath API error (${response.status}):`, errorText);
      throw new Error(
        `Kunne ikke hente anbefalinger (status ${response.status}). Prøv igjen senere.`
      );
    }

    const data: EdPathApiResponse = await response.json();
    console.log('📥 EdPath API response:', data);

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ Network error — cannot reach EdPath API:', error);
      throw new Error(
        'Kunne ikke koble til anbefalingstjenesten. Sjekk internettforbindelsen din.'
      );
    }
    // Re-throw if it's already our formatted error
    if (error instanceof Error && error.message.startsWith('Kunne ikke')) {
      throw error;
    }
    console.error('❌ Unexpected error from EdPath API:', error);
    throw new Error('En uventet feil oppstod. Prøv igjen senere.');
  }
};

/**
 * @deprecated Use getRecommendations(answers, userType) instead
 */
export const getRecommendationsFromApi = async (
  userAnswers: Record<string, number>
): Promise<EdPathApiResponse> => {
  return getRecommendations(userAnswers, 'student');
};
