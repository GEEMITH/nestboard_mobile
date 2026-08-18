import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  BookingAPI,
} from '../api/bookings';

import {
  Booking,
} from '../types/bookings';

export const useBookings = (
  enabled = true,
) => {
  const [
    bookings,
    setBookings,
  ] = useState<Booking[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const fetchBookings =
    useCallback(async () => {
      if (!enabled) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await BookingAPI.getMyBookings();

        const sorted =
          [...response].sort(
            (a, b) =>
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime(),
          );

        setBookings(sorted);
      } catch {
        setError(
          'Unable to load your bookings.',
        );
      } finally {
        setLoading(false);
      }
    }, [enabled]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};