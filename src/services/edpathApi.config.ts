
// ==========================================
// EdPath API Configuration
// ==========================================
// 
// Required environment variables:
//
//   VITE_EDPATH_API_BASE_URL
//     The base URL of the EdPath matching API (without trailing slash).
//     Examples:
//       - Development: http://localhost:8000
//       - Production:  https://api.edpath.no
//
// Set this in your .env file:
//   VITE_EDPATH_API_BASE_URL=https://api.edpath.no
//
// ==========================================

/**
 * Returns the configured EdPath API base URL.
 * Falls back to empty string if not set (API calls will fail gracefully).
 */
export const getEdPathApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_EDPATH_API_BASE_URL;
  if (!url) {
    console.warn(
      '⚠️ VITE_EDPATH_API_BASE_URL is not set. API calls will use local fallback logic.'
    );
    return '';
  }
  // Remove trailing slash
  return url.replace(/\/+$/, '');
};

/**
 * Returns true if the EdPath API is configured and available.
 */
export const isEdPathApiConfigured = (): boolean => {
  return !!import.meta.env.VITE_EDPATH_API_BASE_URL;
};

/**
 * API endpoint paths by user type.
 */
export const EDPATH_ENDPOINTS = {
  elev: '/api/anbefaling/elever',
  student: '/api/anbefaling/studenter',
  arbeidstaker: '/api/anbefaling/arbeidstaker',
} as const;
