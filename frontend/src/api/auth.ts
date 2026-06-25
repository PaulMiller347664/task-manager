import { api } from './axios';
import type { AuthResponse, Credentials } from '../types/auth';

export async function register(credentials: Credentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials);
  return data;
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
}
