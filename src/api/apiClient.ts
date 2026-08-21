import axios from 'axios';

import { store } from '../store/store';
import { logout, saveToken } from '../store/authSlice';

import {
  persistLogin,
  removeRefreshToken,
} from '../util/localStorage';

import { ENV } from '../config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  config => {
    const { accessToken } = store.getState().auth;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const { refreshToken } = store.getState().auth;

    if (!refreshToken) {
      store.dispatch(logout());
      await removeRefreshToken();

      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${ENV.API_BASE_URL}auth/refresh`,
        {
          refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 30000,
        },
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = response.data;

      store.dispatch(
        saveToken({
          accessToken,
          refreshToken: newRefreshToken,
        }),
      );

      await persistLogin(newRefreshToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return apiClient(originalRequest);
    } catch (refreshError) {
      store.dispatch(logout());
      await removeRefreshToken();

      return Promise.reject(refreshError);
    }
  },
);