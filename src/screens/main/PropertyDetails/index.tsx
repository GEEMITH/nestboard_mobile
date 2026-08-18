import {
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import React, {
  useEffect,
  useState,
} from 'react';

import ScreenWrapper
  from './components/ScreenWrapper';

import PropertyDetailsScreen
  from './components/PropertyDetailsScreen';

import {
  PropertyAPI,
} from '../../../api/properties';

import {
  FavouriteAPI,
} from '../../../api/favourites';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import type {
  RootState,
} from '../../../store/store';

import Skeleton
  from '../../../components/ui/Skeleton';

import {
  SCREEN_HEIGHT,
} from '../../../constant/dimentions';

import {
  Colors,
} from '../../../constant/colors';

import {
  saveProperty,
  saveRoomTypes,
} from '../../../store/propertySlice';

import {
  Heart,
} from 'lucide-react-native';

const PropertyDetails = () => {
  const route: any =
    useRoute();

  const nav: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const propertyId =
    route.params?.pid;

  const currentProperty =
    useSelector(
      (state: RootState) =>
        state.property.currentProperty,
    );

  const roomTypes =
    useSelector(
      (state: RootState) =>
        state.property.roomType,
    );

  const [
    favouriteSaved,
    setFavouriteSaved,
  ] = useState(false);

  const [
    favouriteLoading,
    setFavouriteLoading,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    propertyUnavailable,
    setPropertyUnavailable,
  ] = useState(false);

  /*
   * Load property
   */
  useEffect(() => {
    const loadProperty =
      async () => {
        if (!propertyId) {
          setLoading(false);
          setPropertyUnavailable(true);

          Alert.alert(
            'Property unavailable',
            'The property link is invalid.',
            [
              {
                text: 'Go Back',
                onPress: () =>
                  nav.goBack(),
              },
            ],
          );

          return;
        }

        try {
          setLoading(true);
          setPropertyUnavailable(false);

          const data =
            await PropertyAPI.getSingleProperty(
              propertyId,
            );

          if (!data) {
            throw new Error(
              'Property not found',
            );
          }

          dispatch(
            saveProperty(data),
          );

          setFavouriteSaved(
            data.saved ?? false,
          );
        } catch (error: any) {
          console.error(
            'Failed to load property:',
            error,
          );

          const status =
            error?.response?.status;

          if (
            status === 404 ||
            status === 403 ||
            status === 400
          ) {
            setPropertyUnavailable(
              true,
            );

            Alert.alert(
              'Property unavailable',
              'This property no longer exists or is no longer available.',
              [
                {
                  text: 'Go Back',
                  onPress: () =>
                    nav.goBack(),
                },
              ],
            );
          } else {
            Alert.alert(
              'Unable to load property',
              'Please check your connection and try again.',
              [
                {
                  text: 'Go Back',
                  onPress: () =>
                    nav.goBack(),
                },
              ],
            );
          }
        } finally {
          setLoading(false);
        }
      };

    loadProperty();
  }, [
    dispatch,
    propertyId,
    nav,
  ]);

  /*
   * Load room types
   */
  useEffect(() => {
    const loadRoomTypes =
      async () => {
        if (!propertyId) {
          return;
        }

        try {
          const data =
            await PropertyAPI.getPropertyRoomTypes(
              propertyId,
            );

          dispatch(
            saveRoomTypes(data),
          );
        } catch (error: any) {
          console.error(
            'Failed to load room types:',
            error,
          );

          /*
           * If the property itself has already been
           * identified as unavailable, do nothing.
           */
          if (
            propertyUnavailable
          ) {
            return;
          }
        }
      };

    loadRoomTypes();
  }, [
    dispatch,
    propertyId,
    propertyUnavailable,
  ]);

  /*
   * Favourite toggle
   */
  const handleFavourite =
    async () => {
      if (
        favouriteLoading ||
        !propertyId ||
        propertyUnavailable
      ) {
        return;
      }

      const previous =
        favouriteSaved;

      setFavouriteSaved(
        !previous,
      );

      setFavouriteLoading(
        true,
      );

      try {
        const response =
          await FavouriteAPI.toggleFavourite(
            propertyId,
          );

        const nextSaved =
  response.isFavorite;

        setFavouriteSaved(
          nextSaved,
        );
      } catch (error: any) {
        console.error(
          'Favourite error:',
          error,
        );

        setFavouriteSaved(
          previous,
        );

        const status =
          error?.response?.status;

        if (
          status === 404 ||
          status === 403
        ) {
          setPropertyUnavailable(
            true,
          );

          Alert.alert(
            'Property unavailable',
            'This property is no longer available.',
            [
              {
                text: 'Go Back',
                onPress: () =>
                  nav.goBack(),
              },
            ],
          );

          return;
        }

        Alert.alert(
          'Error',
          'Unable to update favourite.',
        );
      } finally {
        setFavouriteLoading(
          false,
        );
      }
    };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <ScreenWrapper>
        <Skeleton
          height={
            SCREEN_HEIGHT * 0.55
          }
          style={{
            marginTop: '90%',
          }}
          width="100%"
        />
      </ScreenWrapper>
    );
  }

  /*
   * Prevent rendering stale Redux data when
   * a QR/deep link property is invalid.
   */
  if (
    propertyUnavailable ||
    !currentProperty
  ) {
    return (
      <ScreenWrapper>
        <View
          style={
            styles.unavailableContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              Colors.PRIMARY_COLOR
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  /*
   * Extra safety:
   * Never display a previously loaded property's
   * Redux data for a different property ID.
   */
  if (
    currentProperty.id !==
    propertyId
  ) {
    return (
      <ScreenWrapper>
        <View
          style={
            styles.unavailableContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              Colors.PRIMARY_COLOR
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View
        style={
          styles.container
        }
      >
        {/* Favourite button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={
            favouriteLoading
          }
          onPress={
            handleFavourite
          }
          style={
            styles.favouriteButton
          }
        >
          {favouriteLoading ? (
            <ActivityIndicator
              size="small"
              color="#EF4444"
            />
          ) : (
            <Heart
              size={24}
              color={
                favouriteSaved
                  ? '#EF4444'
                  : Colors.ICON_GRAY
              }
              fill={
                favouriteSaved
                  ? '#EF4444'
                  : 'transparent'
              }
            />
          )}
        </TouchableOpacity>

        <PropertyDetailsScreen
          title={
            currentProperty.title
          }
          address={
            currentProperty.address
          }
          badges={[
            ...(
              currentProperty.amenities ??
              []
            ),
          ]}
          stats={{
            seatsAvailable: 10,
            minStayMonths:
              currentProperty.minStay,
            priceFrom: 'LKR 15K',
          }}
          rooms={
            roomTypes ?? []
          }
          rating={
            Number(
              currentProperty.rating,
            )
          }
          onViewReviews={() =>
            nav.navigate(
              'PropertyReviews',
              {
                propertyId:
                  currentProperty.id,

                propertyTitle:
                  currentProperty.title,
              },
            )
          }
          onViewRooms={(
  roomTypeId,
  roomTypeName,
) => {
  nav.navigate(
    'RoomTypeDetails',
    {
      roomTypeId,
      roomTypeName,
      location:
        currentProperty.address ??
        currentProperty.city ??
        '',
    },
  );
}}
        />
      </View>
    </ScreenWrapper>
  );
};

export default PropertyDetails;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },

    favouriteButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor:
        'rgba(255,255,255,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      elevation: 5,
    },

    unavailableContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });