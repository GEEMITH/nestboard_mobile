import {
  useEffect,
  useState,
} from 'react';

import {
  PropertyAPI,
} from '../api/properties';

import {
  useSelector,
} from 'react-redux';

import type {
  RootState,
} from '../store/store';

import type {
  RoomType,
} from '../types/properties';

export const useRoomTypeDetails = (
  roomTypeId: string,
) => {
  const currentProperty =
    useSelector(
      (
        state: RootState,
      ) =>
        state.property
          .currentProperty,
    );

  const [
    roomType,
    setRoomType,
  ] = useState<
    RoomType | undefined
  >(undefined);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (
        !currentProperty?.id ||
        !roomTypeId
      ) {
        setRoomType(
          undefined,
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError(null);

        const result =
          await PropertyAPI.getSingleRoomType(
            currentProperty.id,
            roomTypeId,
          );

        if (!cancelled) {
          setRoomType(
            result,
          );
        }
      } catch (err) {
        console.error(
          'Failed to load room type:',
          err,
        );

        if (!cancelled) {
          setRoomType(
            undefined,
          );

          setError(
            'Unable to load room details.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    currentProperty?.id,
    roomTypeId,
  ]);

  return {
    roomType,
    loading,
    error,
  };
};