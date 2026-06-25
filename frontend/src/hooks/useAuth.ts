import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api/auth';
import type { AuthResponse, Credentials } from '../types/auth';
import { clearAuth, setAuth } from '../utils/auth';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, Credentials>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.token, data.email);
      queryClient.clear();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, Credentials>({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setAuth(data.token, data.email);
      queryClient.clear();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearAuth();
    queryClient.clear();
    navigate('/login', { replace: true });
  };
}
