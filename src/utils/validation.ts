
import { z } from 'zod';

// Security: Input sanitization functions
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: urls
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeInput(email);
  return sanitized.toLowerCase();
};

// Security: Validation schemas with strict rules
export const emailSchema = z
  .string()
  .email('Ugyldig e-postadresse')
  .min(5, 'E-postadressen må være minst 5 tegn')
  .max(254, 'E-postadressen kan ikke være lengre enn 254 tegn')
  .refine(
    (email) => !email.includes('<') && !email.includes('>'),
    'E-postadressen inneholder ugyldige tegn'
  );

export const passwordSchema = z
  .string()
  .min(8, 'Passordet må være minst 8 tegn')
  .max(128, 'Passordet kan ikke være lengre enn 128 tegn')
  .regex(/[A-Z]/, 'Passordet må inneholde minst én stor bokstav')
  .regex(/[a-z]/, 'Passordet må inneholde minst én liten bokstav')
  .regex(/[0-9]/, 'Passordet må inneholde minst ett tall')
  .regex(/[^A-Za-z0-9]/, 'Passordet må inneholde minst ett spesialtegn');

export const nameSchema = z
  .string()
  .min(1, 'Navn er påkrevd')
  .max(50, 'Navnet kan ikke være lengre enn 50 tegn')
  .regex(/^[a-zA-ZæøåÆØÅ\s-']+$/, 'Navnet kan kun inneholde bokstaver, mellomrom, bindestrek og apostrof');

// Security: Rate limiting helper
const requestTimestamps = new Map<string, number[]>();

export const isRateLimited = (identifier: string, maxRequests = 5, windowMs = 60000): boolean => {
  const now = Date.now();
  const timestamps = requestTimestamps.get(identifier) || [];
  
  // Remove old timestamps outside the window
  const validTimestamps = timestamps.filter(timestamp => now - timestamp < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return true;
  }
  
  validTimestamps.push(now);
  requestTimestamps.set(identifier, validTimestamps);
  return false;
};
