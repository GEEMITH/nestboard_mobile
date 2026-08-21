import { apiClient } from './apiClient';

import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AuthTokens,
} from '../types/auth';

export const AuthAPI = {
  login: async (
    payload: LoginPayload,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      'auth/login',
      payload,
    );

    return response.data;
  },

  socialAuth: async (
    idToken: string,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      'auth/google',
      {
        idToken,
      },
    );

    return response.data;
  },

  register: async (
    payload: RegisterPayload,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      'auth/register',
      payload,
    );

    return response.data;
  },

  refresh: async (
    refreshToken: string,
  ): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>(
      'auth/refresh',
      {
        refreshToken,
      },
    );

    return response.data;
  },
};