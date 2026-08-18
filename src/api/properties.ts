import {
  Property,
  PropertyListResponse,
  PropertyLocation,
  RoomType,
} from '../types/properties';

import {
  PropertyType,
} from '../types/common';

import {
  apiClient,
} from './apiClient';

export type PropertyFilters = {
  page: number;
  limit: number;
  search?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  cities?: string[];
  minRating?: number;
  sort?:
    | 'recency'
    | 'price_asc'
    | 'price_desc'
    | 'rating_desc';
};

export const PropertyAPI = {
  getAllProperties:
    async (
      filters: PropertyFilters,
    ) => {
      const params =
        new URLSearchParams();

      params.append(
        'page',
        String(filters.page),
      );

      params.append(
        'limit',
        String(filters.limit),
      );

      if (
        filters.search?.trim()
      ) {
        params.append(
          'search',
          filters.search.trim(),
        );
      }

      if (
        filters.type &&
        filters.type !== 'All'
      ) {
        params.append(
          'type',
          filters.type.toLowerCase(),
        );
      }

      if (
        filters.cities?.length
      ) {
        params.append(
          'city',
          filters.cities.join(','),
        );
      }

      if (
        filters.minPrice !==
          undefined &&
        filters.minPrice > 0
      ) {
        params.append(
          'minPrice',
          String(
            Math.round(
              filters.minPrice,
            ),
          ),
        );
      }

      if (
        filters.maxPrice !==
          undefined &&
        filters.maxPrice > 0
      ) {
        params.append(
          'maxPrice',
          String(
            Math.round(
              filters.maxPrice,
            ),
          ),
        );
      }

      if (
        filters.minRating !==
          undefined &&
        filters.minRating > 0
      ) {
        params.append(
          'minRating',
          String(
            filters.minRating,
          ),
        );
      }

      if (filters.sort) {
        params.append(
          'sort',
          filters.sort,
        );
      }

      const response =
        await apiClient.get<any>(
          `properties?${params.toString()}`,
        );

      const data =
        response.data;

      return {
        ...data,
        data: data.data.map(
          (property: any) => ({
            ...property,
            saved:
              property.isFavorite ??
              false,
          }),
        ),
      } as PropertyListResponse;
    },

  getSingleProperty:
    async (
      id: string,
    ) => {
      const response =
        await apiClient.get<any>(
          `properties/${id}`,
        );

      return {
        ...response.data,
        saved:
          response.data.isFavorite ??
          false,
      } as Property;
    },

  getPropertyRoomTypes:
    async (
      id: string,
    ) => {
      const response =
        await apiClient.get<RoomType[]>(
          `properties/${id}/room-types`,
        );

      return response.data;
    },

  getSingleRoomType:
    async (
      propertyId: string,
      roomTypeId: string,
    ) => {
      const response =
        await apiClient.get<RoomType>(
          `properties/${propertyId}/room-types/${roomTypeId}`,
        );

      return response.data;
    },

  getMapList:
    async () => {
      const response =
        await apiClient.get<PropertyLocation[]>(
          'properties/map-list',
        );

      return response.data;
    },
};