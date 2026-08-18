import { apiClient } from './apiClient';

import type {
  AppNotification,
} from '../types/notifications';

export const NotificationsAPI = {
  getAll: async (): Promise<
    AppNotification[]
  > => {
    const response =
      await apiClient.get<
        AppNotification[]
      >('/notifications');

    return response.data;
  },

  markAsRead: async (
    id: string,
  ): Promise<AppNotification> => {
    const response =
      await apiClient.patch<
        AppNotification
      >(
        `/notifications/${id}/read`,
      );

    return response.data;
  },

  markAllAsRead: async (): Promise<{
    updated: number;
  }> => {
    const response =
      await apiClient.patch(
        '/notifications/read-all',
      );

    return response.data;
  },
};