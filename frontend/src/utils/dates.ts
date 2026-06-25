import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a UTC ISO string from the API into the user's local date/time
 * for display. date-fns parses the offset and renders in local time.
 */
export function formatLocalDateTime(isoString?: string | null): string {
  if (!isoString) {
    return '';
  }
  const date = parseISO(isoString);
  return isValid(date) ? format(date, 'PPp') : '';
}

/**
 * Converts a value from an <input type="datetime-local"> (which is in local
 * time, no offset) into a UTC ISO string for the API.
 */
export function localInputToUtcIso(localValue: string): string | null {
  if (!localValue) {
    return null;
  }
  const date = new Date(localValue);
  return isValid(date) ? date.toISOString() : null;
}

/**
 * Converts a UTC ISO string from the API into the value format expected by
 * an <input type="datetime-local"> (local time, "yyyy-MM-ddTHH:mm").
 */
export function utcIsoToLocalInput(isoString?: string | null): string {
  if (!isoString) {
    return '';
  }
  const date = parseISO(isoString);
  return isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : '';
}

export function isPastDate(isoString?: string | null): boolean {
  if (!isoString) {
    return false;
  }
  const date = parseISO(isoString);
  return isValid(date) && date.getTime() < Date.now();
}
