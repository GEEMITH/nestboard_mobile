import {
  API_BASE_URL,
  API_HEALTH_URL,
} from '@env';

const normalizeUrl = (url: string): string => {
  const trimmed = url.trim();

  if (!trimmed) {
    throw new Error('API URL is missing');
  }

  return trimmed.endsWith('/')
    ? trimmed
    : `${trimmed}/`;
};

export const ENV = {
  API_BASE_URL: normalizeUrl(API_BASE_URL),
  API_HEALTH_URL: normalizeUrl(API_HEALTH_URL),
} as const;

console.log('========== ENV CONFIG ==========');
console.log('API_BASE_URL:', ENV.API_BASE_URL);
console.log('API_HEALTH_URL:', ENV.API_HEALTH_URL);
console.log('================================');