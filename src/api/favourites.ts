import {
  apiClient,
} from './apiClient';

import {
  Property,
} from '../types/properties';

export type FavouriteResponse = {
  propertyId: string;
  isFavorite: boolean;
};

export const FavouriteAPI = {
  getMyFavourites:
    async (): Promise<Property[]> => {
      const response =
        await apiClient.get<
          Property[]
        >(
          'properties/my-favourites',
        );

      return response.data;
    },

  toggleFavourite:
    async (
      propertyId: string,
    ): Promise<FavouriteResponse> => {
      const response =
        await apiClient.patch<FavouriteResponse>(
          `properties/${propertyId}/toggle-favorite`,
        );

      return response.data;
    },

  addFavourite:
    async (
      propertyId: string,
    ): Promise<FavouriteResponse> => {
      return FavouriteAPI.toggleFavourite(
        propertyId,
      );
    },

  removeFavourite:
    async (
      propertyId: string,
    ): Promise<FavouriteResponse> => {
      return FavouriteAPI.toggleFavourite(
        propertyId,
      );
    },
};