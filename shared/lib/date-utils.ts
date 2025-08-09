/**
 * Project-wide date utilities (client-safe)
 */

/** Converts a date value to ISO string */
export function toISOString(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/** Converts a date value to a Date object */
export function toDate(date: Date | string): Date {
  if (typeof date === 'string') return new Date(date);
  return date;
}

/** Formats a date for display using locale */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleDateString(locale);
}

/** Formats a date+time for display using locale */
export function formatDateTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleString(locale);
}

/** Formats a date as DD.MM.YYYY */
export function formatDateDDMMYYYY(date: Date | string): string {
  const dateObj = toDate(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}.${month}.${year}`;
}
