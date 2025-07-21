/**
 * Utility functions for handling dates in employee management
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
 * Formats a date for display in Russian locale
 * Handles both Date objects and string values
 */
export function formatDate(
  date: Date | string,
  locale: string = 'ru-RU'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleDateString(locale);
}

/**
 * Formats a date and time for display in Russian locale
 * Handles both Date objects and string values
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'ru-RU'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleString(locale);
}

/**
 * Formats a date in DD.MM.YYYY format
 * Handles both Date objects and string values
 */
export function formatDateDDMMYYYY(date: Date | string): string {
  const dateObj = toDate(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}.${month}.${year}`;
}
