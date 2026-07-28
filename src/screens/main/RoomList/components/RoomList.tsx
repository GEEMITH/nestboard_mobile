import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import RoomCard from './RoomCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoomType } from '../../../../types/properties';

type Props = {
  roomType: RoomType
}

const RoomList = ({ roomType }: Props) => {

  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={
      {
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 16,
        paddingTop: 16
      }
    }>
      {
        roomType.rooms.map(room => <RoomCard key={room.roomId} room={room} price={roomType.pricePerMonth} />)
      }
    </ScrollView>
  )
}

export default RoomList