
/**
 * Utility functions for extracting data from user profiles
 */

/**
 * Extract boolean attributes from an object
 * @param dataObject Object containing boolean attributes
 * @returns Array of keys where the value is true
 */
export const extractBooleanAttributes = (dataObject: Record<string, any> | undefined): string[] => {
  if (!dataObject) return [];
  return Object.keys(dataObject).filter(key => dataObject[key] === true);
};

/**
 * Check if a user is a bachelor student based on their level
 * @param level Education level string
 * @returns Boolean indicating if user is a bachelor student
 */
export const isBachelorStudent = (level?: string): boolean => {
  return level?.toLowerCase().includes('bachelor') || false;
};

