/**
 * Utility functions for handling dates in file management
 */

/**
 * Converts a date value to ISO string format
 * Handles both Date objects and string values
 */
export function toISOString(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
}

/**
 * Converts a date value to a proper Date object
 * Handles both Date objects and string values
 */
export function toDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

/**
 * Formats a date for display
 * Handles both Date objects and string values
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleDateString(locale);
}

/**
 * Formats a date and time for display
 * Handles both Date objects and string values
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleString(locale);
}
