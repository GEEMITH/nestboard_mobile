import { createAsyncStorage } from '@react-native-async-storage/async-storage';

const storage = createAsyncStorage('nestBoard');

export const persistLogin = async (
  refreshToken: string,
) => {
  await storage.setItem(
    'refreshToken',
    refreshToken,
  );
};

export const checkStatus = async () => {
  return await storage.getItem(
    'refreshToken',
  );
};

export const removeRefreshToken = async () => {
  await storage.removeItem(
    'refreshToken',
  );
};