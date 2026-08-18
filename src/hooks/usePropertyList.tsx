import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  PropertyAPI,
  PropertyFilters,
} from '../api/properties';

import { PropertyItem } from '../types/properties';

type Props = {
  currentPType: PropertyFilters['type'];
  range: {
    min: number;
    max: number;
  };
  checkedCities: {
    city: string;
    checked: boolean;
  }[];
  search: string;
  triggerFilter: number;
};

export const usePropertyList = ({
  currentPType,
  range,
  checkedCities,
  search,
  triggerFilter,
}: Props) => {
  const LIMIT = 6;

  const [properties, setProperties] =
    useState<PropertyItem[]>([]);

  const [page, setPage] = useState(1);

  const [hasNext, setHasNext] =
    useState(false);

  const [fetching, setFetching] =
    useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const requestId =
    useRef(0);

  const buildFilters = useCallback(
    (requestedPage: number): PropertyFilters => ({
      page: requestedPage,
      limit: LIMIT,

      type: currentPType,

      search: search.trim(),

      minPrice:
        range.min > 0
          ? range.min
          : undefined,

      maxPrice:
        range.max > 0
          ? range.max
          : undefined,

      cities: checkedCities
        .filter(city => city.checked)
        .map(city => city.city),

      sort: 'recency',
    }),
    [
      currentPType,
      range.min,
      range.max,
      checkedCities,
      search,
    ],
  );

  const fetchFirstPage = useCallback(
    async () => {
      const currentRequest =
        ++requestId.current;

      setInitialLoading(true);
      setFetching(false);
      setError(null);
      setProperties([]);
      setPage(1);
      setHasNext(false);

      try {
        const response =
          await PropertyAPI.getAllProperties(
            buildFilters(1),
          );

        if (
          currentRequest !== requestId.current
        ) {
          return;
        }

        setProperties(response.data);
        setHasNext(
          response.meta.hasNextPage,
        );
        setPage(
          response.meta.hasNextPage
            ? 2
            : 1,
        );
      } catch {
        if (
          currentRequest !== requestId.current
        ) {
          return;
        }

        setProperties([]);
        setHasNext(false);
        setError(
          'Unable to load properties. Please try again.',
        );
      } finally {
        if (
          currentRequest === requestId.current
        ) {
          setInitialLoading(false);
        }
      }
    },
    [buildFilters],
  );

  const fetchNextBatch =
    useCallback(async () => {
      if (
        fetching ||
        !hasNext ||
        initialLoading
      ) {
        return;
      }

      setFetching(true);
      setError(null);

      try {
        const response =
          await PropertyAPI.getAllProperties(
            buildFilters(page),
          );

        setProperties(current => {
          const existingIds =
            new Set(
              current.map(
                property => property.id,
              ),
            );

          const newItems =
            response.data.filter(
              property =>
                !existingIds.has(
                  property.id,
                ),
            );

          return [
            ...current,
            ...newItems,
          ];
        });

        setHasNext(
          response.meta.hasNextPage,
        );

        setPage(
          response.meta.hasNextPage
            ? response.meta.page + 1
            : response.meta.page,
        );
      } catch {
        setError(
          'Unable to load more properties.',
        );
      } finally {
        setFetching(false);
      }
    }, [
      buildFilters,
      fetching,
      hasNext,
      initialLoading,
      page,
    ]);

  useEffect(() => {
    fetchFirstPage();
  }, [
    currentPType,
    triggerFilter,
    fetchFirstPage,
  ]);

  return {
    properties,
    fetchNextBatch,
    fetching,
    initialLoading,
    error,
    retry: fetchFirstPage,
  };
};