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
 * Converts separate local date/time inputs into a UTC ISO string for the API.
 * Date-only defaults to 23:59 local (end of day). Time without date is invalid.
 */
export function localDateAndTimeToUtcIso(
  dateValue: string,
  timeValue: string,
): string | null {
  if (!dateValue && !timeValue) {
    return null;
  }

  const combined = `${dateValue}T${timeValue || '23:59'}`;
  const date = new Date(combined);
  return isValid(date) ? date.toISOString() : null;
}

export function validateDueDateParts(
  dateValue: string,
  timeValue: string,
): string | null {
  if (!dateValue && timeValue) {
    return 'Due date is required when a time is set.';
  }

  return null;
}

/**
 * Converts a UTC ISO string from the API into local date and time field values.
 */
export function utcIsoToLocalDateInput(isoString?: string | null): string {
  if (!isoString) {
    return '';
  }
  const date = parseISO(isoString);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}

export function utcIsoToLocalTimeInput(isoString?: string | null): string {
  if (!isoString) {
    return '';
  }
  const date = parseISO(isoString);
  return isValid(date) ? format(date, 'HH:mm') : '';
}

export function isPastDate(isoString?: string | null): boolean {
  if (!isoString) {
    return false;
  }
  const date = parseISO(isoString);
  return isValid(date) && date.getTime() < Date.now();
}
