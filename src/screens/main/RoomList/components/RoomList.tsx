import React from 'react';

import {
  ScrollView,
} from 'react-native';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import RoomCard
  from './RoomCard';

import type {
  RoomType,
} from '../../../../types/properties';

type Props = {
  roomType: RoomType;
};

const RoomList = ({
  roomType,
}: Props) => {
  const insets =
    useSafeAreaInsets();

  const rooms =
    Array.isArray(
      roomType.rooms,
    )
      ? roomType.rooms
      : [];

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,

        paddingHorizontal: 16,

        paddingTop: 16,

        paddingBottom:
          insets.bottom + 30,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      {rooms.map(
        room => (
          <RoomCard
            key={
              room.roomId
            }
            room={room}
            price={
              roomType.pricePerMonth
            }
          />
        ),
      )}
    </ScrollView>
  );
};

export default RoomList;