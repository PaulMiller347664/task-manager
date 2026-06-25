export interface AuthResponse {
  token: string;
  email: string;
  expiresAt: string;
}

export interface Credentials {
  email: string;
  password: string;
}
