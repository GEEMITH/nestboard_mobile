import axios from 'axios';
import { store } from '../store/store';
import { logout, saveToken } from '../store/authSlice';
import {
  persistLogin,
  removeRefreshToken,
} from '../util/localStorage';
import { ENV } from '../config/env';

console.log('========== API CLIENT CONFIG ==========');
console.log('BASE URL:', ENV.API_BASE_URL);
console.log('HEALTH URL:', ENV.API_HEALTH_URL);
console.log('=======================================');

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

    console.log('========== API REQUEST ==========');
    console.log('METHOD:', config.method?.toUpperCase());
    console.log('BASE URL:', config.baseURL);
    console.log('ENDPOINT:', config.url);
    console.log(
      'FULL URL:',
      `${config.baseURL || ''}${config.url || ''}`,
    );
    console.log('DATA:', config.data);
    console.log('=================================');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    console.log('========== REQUEST ERROR ==========');
    console.log(error);
    console.log('===================================');

    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => {
    console.log('========== API RESPONSE ==========');
    console.log('STATUS:', response.status);
    console.log('URL:', response.config.url);
    console.log('DATA:', response.data);
    console.log('==================================');

    return response;
  },

  async error => {
    console.log('========== API ERROR ==========');
    console.log('MESSAGE:', error?.message);
    console.log('STATUS:', error?.response?.status);
    console.log('DATA:', error?.response?.data);
    console.log('BASE URL:', error?.config?.baseURL);
    console.log('ENDPOINT:', error?.config?.url);
    console.log(
      'FULL URL:',
      `${error?.config?.baseURL || ''}${error?.config?.url || ''}`,
    );
    console.log('===============================');

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
      console.log('========== REFRESH TOKEN ==========');
      console.log(
        'REFRESH URL:',
        `${ENV.API_BASE_URL}auth/refresh`,
      );
      console.log('===================================');

      const response = await axios.post(
        `${ENV.API_BASE_URL}auth/refresh`,
        {
          refreshToken,
        },
        {
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
    } catch (refreshError: any) {
      console.log('========== REFRESH FAILED ==========');
      console.log('MESSAGE:', refreshError?.message);
      console.log('STATUS:', refreshError?.response?.status);
      console.log('DATA:', refreshError?.response?.data);
      console.log('====================================');

      store.dispatch(logout());
      await removeRefreshToken();

      return Promise.reject(refreshError);
    }
  },
);