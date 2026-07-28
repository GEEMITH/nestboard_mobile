import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import RoomListHeader from './components/Header'
import { useRoute } from '@react-navigation/native'
import RoomList from './components/RoomList'
import { Colors } from '../../../constant/colors'
import { useRoomTypeDetails } from '../../../hooks/useRoomTypeDetails'

const RoomTypeDetails = () => {

  const data: any = useRoute().params

  const { roomType } = useRoomTypeDetails(data.roomTypeId);

  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors.WHITE
    }}>
      <RoomListHeader location={data.location} name={data.roomTypeName} />
      {
        roomType && <RoomList roomType={roomType} />
      }
    </View>
  )
}

export default RoomTypeDetails