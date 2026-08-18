import { apiClient } from './apiClient';

import type {
  UpdateProfilePayload,
  UserProfile,
} from '../types/profile';

export const ProfileAPI = {
  getMe: async (): Promise<UserProfile> => {
    const response =
      await apiClient.get<UserProfile>(
        '/auth/me',
      );

    return response.data;
  },

  updateMe: async (
    payload: UpdateProfilePayload,
  ): Promise<UserProfile> => {
    const response =
      await apiClient.patch<UserProfile>(
        '/auth/me',
        payload,
      );

    return response.data;
  },

  uploadProfileImage: async (
    uri: string,
    type: string,
    fileName: string,
  ): Promise<{ url: string }> => {
    const formData = new FormData();

    formData.append(
      'image',
      {
        uri,
        type,
        name: fileName,
      } as any,
    );

    const response =
      await apiClient.post(
        '/uploads/profile-image',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        },
      );

    return response.data;
  },
};