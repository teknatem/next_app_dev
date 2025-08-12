/**
 * Utility functions for handling dates in employee management (client-safe)
 */

export function toISOString(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
}

export function toDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

export function formatDate(
  date: Date | string,
  locale: string = 'ru-RU'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleDateString(locale);
}

export function formatDateTime(
  date: Date | string,
  locale: string = 'ru-RU'
): string {
  const dateObj = toDate(date);
  return dateObj.toLocaleString(locale);
}

export function formatDateDDMMYYYY(date: Date | string): string {
  const dateObj = toDate(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}.${month}.${year}`;
}
