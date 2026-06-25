import { format, parseISO, isValid } from 'date-fns';

/** Formats a UTC ISO string from the API as a local calendar date. */
export function formatLocalDate(isoString?: string | null): string {
  if (!isoString) {
    return '';
  }
  const date = parseISO(isoString);
  return isValid(date) ? format(date, 'PP') : '';
}

/** Converts a local date input (yyyy-MM-dd) into a UTC ISO string for the API. */
export function localDateToUtcIso(dateValue: string): string | null {
  if (!dateValue) {
    return null;
  }

  const date = new Date(`${dateValue}T00:00:00`);
  return isValid(date) ? date.toISOString() : null;
}

/** Converts a UTC ISO string from the API into a local date input value. */
export function utcIsoToLocalDateInput(isoString?: string | null): string {
  if (!isoString) {
    return '';
  }
  const date = parseISO(isoString);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}

/** True when the due calendar date is before today (local). Due today is not overdue. */
export function isPastDate(isoString?: string | null): boolean {
  if (!isoString) {
    return false;
  }
  const date = parseISO(isoString);
  if (!isValid(date)) {
    return false;
  }
  return format(date, 'yyyy-MM-dd') < format(new Date(), 'yyyy-MM-dd');
}

export function validateDueDateInput(dateValue: string): string | null {
  if (!dateValue) {
    return null;
  }

  if (dateValue < format(new Date(), 'yyyy-MM-dd')) {
    return 'Due date cannot be in the past.';
  }

  return null;
}
