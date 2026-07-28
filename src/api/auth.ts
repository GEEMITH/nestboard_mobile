// src/api/authAPI.ts
import { apiClient } from "./apiClient";
import { AuthResponse, LoginPayload, RegisterPayload, AuthTokens } from "../types/auth";

export const AuthAPI = {
  login: async (payload: LoginPayload) => {
    const d = await apiClient.post<AuthResponse>('auth/login', payload);
    return d.data;
  },

  socialAuth: async (idToken: string) => {
    const d = await apiClient.post<AuthResponse>('auth/google', {
      idToken
    });
    return d.data;
  },

  register: async (payload: RegisterPayload) => {
    //     {
    //   email: "abc@gmail.com";
    //   password: "123123123";
    //   displayName?: "Max";
    // }
    const d = await apiClient.post<AuthResponse>('auth/register', payload);
    return d.data;
  },

  refresh: async (refreshToken: string) => {
    const d = await apiClient.post<AuthTokens>('auth/refresh', { refreshToken });
    return d.data;
  },
};