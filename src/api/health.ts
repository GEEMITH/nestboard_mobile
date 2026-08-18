import axios from 'axios';
import { ENV } from '../config/env';

export type HealthResponse = {
  status: string;
  db?: string;
  timestamp?: string;
};

export const HealthAPI = {
  checkReady: async (): Promise<HealthResponse> => {
    const response = await axios.get<HealthResponse>(
      ENV.API_HEALTH_URL,
      {
        timeout: 30000,
      },
    );

    return response.data;
  },
};