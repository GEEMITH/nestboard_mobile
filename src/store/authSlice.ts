import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  refreshToken: string;
  accessToken: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  refreshToken: '',
  accessToken: '',
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    saveToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    logout: state => {
      state.accessToken = '';
      state.refreshToken = '';
      state.isAuthenticated = false;
    },
  },
});

export const {
  saveToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;