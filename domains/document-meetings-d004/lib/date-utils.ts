// Shared utility functions for date formatting and meeting time calculations

/**
 * Format a date for display in the UI
 */
export function formatMeetingDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a time for display in the UI
 */
export function formatMeetingTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a datetime for display in the UI
 */
export function formatMeetingDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate the duration of a meeting in minutes
 */
export function calculateMeetingDuration(
  startedAt: string | Date,
  endedAt?: string | Date | null
): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();

  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60));
}

/**
 * Format meeting duration for display
 */
export function formatMeetingDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
}

/**
 * Check if a meeting is currently in progress
 */
export function isMeetingInProgress(
  startedAt: string | Date,
  endedAt?: string | Date | null
): boolean {
  const now = new Date();
  const start = new Date(startedAt);

  if (endedAt) {
    const end = new Date(endedAt);
    return now >= start && now <= end;
  }

  return now >= start;
}

/**
 * Check if a meeting is scheduled for the future
 */
export function isMeetingScheduled(startedAt: string | Date): boolean {
  const now = new Date();
  const start = new Date(startedAt);
  return now < start;
}

/**
 * Check if a meeting has ended
 */
export function isMeetingEnded(
  startedAt: string | Date,
  endedAt?: string | Date | null
): boolean {
  if (!endedAt) {
    return false;
  }

  const now = new Date();
  const end = new Date(endedAt);
  return now > end;
}

/**
 * Get meeting status based on start and end times
 */
export function getMeetingStatus(
  startedAt: string | Date,
  endedAt?: string | Date | null
): 'scheduled' | 'in_progress' | 'completed' {
  if (isMeetingScheduled(startedAt)) {
    return 'scheduled';
  }

  if (isMeetingInProgress(startedAt, endedAt)) {
    return 'in_progress';
  }

  return 'completed';
}

/**
 * Convert ISO string to local datetime string for form inputs
 */
export function toLocalDateTimeString(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert local datetime string to ISO string
 */
export function fromLocalDateTimeString(localString: string): string {
  return new Date(localString).toISOString();
}
