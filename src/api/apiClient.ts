import axios from "axios";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { store } from "../store/store";
import { logout, saveToken } from "../store/authSlice";
import { persistLogin, removeRefreshToken } from "../util/localStorage";
import { Platform } from "react-native";
const storage = createAsyncStorage("appDB");

const ANDROID_IP = "10.0.2.2"
const IOS_IP = "127.0.0.1"

export const apiClient = axios.create({
  baseURL: `http://${(Platform.OS == 'android') ? ANDROID_IP : IOS_IP}:3001/api/`, //127.0.0.1
  // baseURL: 'https://fed-backend-k7mo.onrender.com/api/',
  //"http://172.20.10.5:3001/api/" + "properties"
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor — attach the access token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor — refresh on 401, then retry once
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken } = store.getState().auth;
      if (!refreshToken) {
        store.dispatch(logout())
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}auth/refresh`,
          { refreshToken }
        );
        store.dispatch(saveToken({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }));
        persistLogin(data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch (refreshErr) {
        store.dispatch(logout());
        removeRefreshToken();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);


