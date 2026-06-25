import { AxiosError } from 'axios';
import type { ProblemDetails } from '../types/api';

export interface ParsedApiError {
  message: string;
  fieldErrors: Record<string, string>;
}

/**
 * Normalises any error (Axios/ProblemDetails/unknown) into a user-friendly
 * message plus a map of field-level validation errors.
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (error instanceof AxiosError) {
    const problem = error.response?.data as ProblemDetails | undefined;

    const fieldErrors: Record<string, string> = {};
    if (problem?.errors) {
      for (const [key, messages] of Object.entries(problem.errors)) {
        if (messages && messages.length > 0) {
          // Normalise the field key to camelCase (ASP.NET uses PascalCase).
          const field = key.charAt(0).toLowerCase() + key.slice(1);
          fieldErrors[field] = messages[0];
        }
      }
    }

    const message =
      problem?.detail ||
      problem?.title ||
      (Object.keys(fieldErrors).length > 0
        ? 'Please fix the highlighted fields.'
        : error.message) ||
      'Something went wrong.';

    return { message, fieldErrors };
  }

  if (error instanceof Error) {
    return { message: error.message, fieldErrors: {} };
  }

  return { message: 'An unexpected error occurred.', fieldErrors: {} };
}
