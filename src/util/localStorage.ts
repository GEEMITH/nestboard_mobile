import { createAsyncStorage } from "@react-native-async-storage/async-storage";

// create a storage instance
const storage = createAsyncStorage("nestBoard");

export const persistLogin = (refreshToken: string) => {
  storage.setItem("refreshToken", refreshToken)
}

export const checkStatus = async () => {
  const v = await storage.getItem("refreshToken");
  return v;
}

export const removeRefreshToken = async () => {
  storage.removeItem("refreshToken")
}


