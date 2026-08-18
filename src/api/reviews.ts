import { apiClient } from './apiClient';

import {
  CreateReviewPayload,
  Review,
  ReviewEligibility,
} from '../types/reviews';

export const ReviewAPI = {
  getPropertyReviews: async (
    propertyId: string,
  ) => {
    const response =
      await apiClient.get<Review[]>(
        `properties/${propertyId}/reviews`,
      );

    return response.data;
  },

  getMyReview: async (
    propertyId: string,
  ) => {
    const response =
      await apiClient.get<Review | null>(
        `properties/${propertyId}/reviews/me`,
      );

    return response.data;
  },

  getEligibility: async (
    propertyId: string,
  ) => {
    const response =
      await apiClient.get<ReviewEligibility>(
        `properties/${propertyId}/reviews/eligibility`,
      );

    return response.data;
  },

  createReview: async (
    propertyId: string,
    payload: CreateReviewPayload,
  ) => {
    const response =
      await apiClient.post<Review>(
        `properties/${propertyId}/reviews`,
        payload,
      );

    return response.data;
  },
};