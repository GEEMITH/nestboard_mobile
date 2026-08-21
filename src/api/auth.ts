import axios from 'axios';

import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AuthTokens,
} from '../types/auth';

import { apiClient } from './apiClient';

const API_ROOT = 'https://nestboard-backend-hra2.vercel.app/api';

export const AuthAPI = {
  login: async (
    payload: LoginPayload,
  ): Promise<AuthResponse> => {
    const url = `${API_ROOT}/auth/login`;

    console.log('LOGIN URL:', url);

    const response = await axios.post<AuthResponse>(
      url,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 30000,
      },
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