// RFC 7807 ProblemDetails (and the validation variant returned by ASP.NET Core).
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}
