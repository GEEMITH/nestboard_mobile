import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  FavouriteAPI,
} from '../api/favourites';

import {
  Property,
} from '../types/properties';

export const useFavourites = (
  enabled = true,
) => {
  const [
    favourites,
    setFavourites,
  ] = useState<Property[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(
    null,
  );

  const fetchFavourites =
    useCallback(
      async () => {
        if (!enabled) {
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const data =
            await FavouriteAPI.getMyFavourites();

          setFavourites(
            data.map(
              property => ({
                ...property,
                saved: true,
              }),
            ),
          );
        } catch (error) {
          console.error(
            'Failed to load favourites:',
            error,
          );

          setError(
            'Unable to load your favourites.',
          );
        } finally {
          setLoading(false);
        }
      },
      [enabled],
    );

  useEffect(() => {
    fetchFavourites();
  }, [
    fetchFavourites,
  ]);

  const removeFavourite =
    useCallback(
      async (
        propertyId: string,
      ) => {
        setUpdatingId(
          propertyId,
        );

        try {
          const response =
            await FavouriteAPI.removeFavourite(
              propertyId,
            );

          if (
            !response.isFavorite
          ) {
            setFavourites(
              current =>
                current.filter(
                  property =>
                    property.id !==
                    propertyId,
                ),
            );
          }

          return true;
        } catch (error) {
          console.error(
            'Failed to remove favourite:',
            error,
          );

          return false;
        } finally {
          setUpdatingId(null);
        }
      },
      [],
    );

  return {
    favourites,
    loading,
    error,
    updatingId,
    refetch:
      fetchFavourites,
    removeFavourite,
  };
};