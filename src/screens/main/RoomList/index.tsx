import React from 'react';

import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

import {
  useRoute,
} from '@react-navigation/native';

import RoomListHeader
  from './components/Header';

import RoomList
  from './components/RoomList';

import {
  Colors,
} from '../../../constant/colors';

import {
  useRoomTypeDetails,
} from '../../../hooks/useRoomTypeDetails';

const RoomTypeDetails =
  () => {
    const route: any =
      useRoute();

    const {
      roomTypeId,
      roomTypeName,
      location,
    } =
      route.params ?? {};

    const {
      roomType,
      loading,
      error,
    } =
      useRoomTypeDetails(
        roomTypeId,
      );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            Colors.WHITE,
        }}
      >
        <RoomListHeader
          location={
            location ?? ''
          }
          name={
            roomTypeName ??
            roomType?.name ??
            'Rooms'
          }
        />

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent:
                'center',
              alignItems:
                'center',
            }}
          >
            <ActivityIndicator
              size="large"
              color={
                Colors.PRIMARY_COLOR
              }
            />
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent:
                'center',
              alignItems:
                'center',
              padding: 24,
            }}
          >
            <Text
              style={{
                textAlign:
                  'center',
                color:
                  Colors.TEXT_GRAY,
              }}
            >
              {error}
            </Text>
          </View>
        ) : roomType ? (
          <RoomList
            roomType={
              roomType
            }
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent:
                'center',
              alignItems:
                'center',
            }}
          >
            <Text
              style={{
                color:
                  Colors.TEXT_GRAY,
              }}
            >
              No room data found.
            </Text>
          </View>
        )}
      </View>
    );
  };

export default RoomTypeDetails;