import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Typography from '../../../../components/ui/Typography'
import { Colors } from '../../../../constant/colors'
import RegularButton from '../../../../components/ui/RegularButton'
import { Room } from '../../../../types/properties'
import { Plus } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { updateBookingDetails } from '../../../../store/bookingSlice'

type Props = {
  room: Room,
  price: string
}

const RoomCard = ({ room, price }: Props) => {

  const extractTwoFirstLetters = (tenant: string) => {
    if (tenant.length > 0) {
      console.log("tenant", tenant)
      const twoNames = tenant.split(' ');
      // console.log("dddd ", twoNames[0].charAt(0).toUpperCase() + "" + twoNames[1].charAt(0).toUpperCase())
      return (twoNames.length > 1) ?
        twoNames[0].charAt(0).toUpperCase() + "" + twoNames[1].charAt(0).toUpperCase()
        :
        twoNames[0].charAt(0).toUpperCase()
    } else {
      return "";
    }
  }

  const [selectedSeat, setSelectedSeat] = useState(0); //1,2,3

  const nav: any = useNavigation();
  const dispatch = useDispatch();

  const bookThisSeat = () => {
    console.log("room", room.roomName)
    dispatch(updateBookingDetails({
      date: "",
      duration: 0,
      roomId: room.roomId,
      roomName: room.roomName,
      seatIndex: selectedSeat,
      pricePerSeat: price
    }))
    nav.navigate('ConfirmBooking')
  }

  return (
    <View style={{
      borderRadius: 16,
      elevation: 2,
      backgroundColor: Colors.WHITE,
      padding: 24,
      gap: 16
    }}>
      <Typography variant='h2'>{room.roomName}</Typography>
      <View style={{
        flexDirection: 'row',
        gap: 12
      }}>
        {
          room.booking.map((seat, index) =>
            (seat.tenant) ?
              // If the tenant is there (if this is a booked seat)
              <View key={seat.seatIndex} style={{
                width: 48, height: 48,
                backgroundColor: "#704F3C",
                justifyContent: 'center',
                alignItems: 'center', borderRadius: 100
              }}>
                <Typography variant='button'>{extractTwoFirstLetters(seat.tenant)}</Typography>
              </View>
              :
              // If the seat is not booked yet.
              <TouchableOpacity key={seat.seatIndex} onPress={() => {
                setSelectedSeat(index + 1)
              }} style={{
                width: 48, height: 48,
                justifyContent: 'center',
                alignItems: 'center', borderRadius: 100,
                borderColor: Colors.BORDER_GRAY,
                borderStyle: 'dashed',
                borderWidth: 1.6,
                backgroundColor: (selectedSeat == (index + 1)) ?
                  "#00000010" : 'transparent'
              }}>
                <Plus color={Colors.BORDER_GRAY} width={20} height={20} />
              </TouchableOpacity>
          )
        }
      </View>
      <View>
        {
          room.booking.map(seat =>
            seat.tenant ?
              <Typography key={seat.seatIndex} variant='subtitle' color={Colors.TEXT_GRAY}>{seat.tenant}</Typography>
              :
              null
          )
        }
      </View>
      <View style={
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      }>
        {/* Available count */}
        <View style={
          {
            backgroundColor: "#D1FAE5",
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderRadius: 100
          }
        }>
          <Typography color='#10B981'>{room.booking.filter(seat => seat.tenant == "").length} Availalbe</Typography>
        </View>

        {/* Booking button */}
        <RegularButton disable={selectedSeat == 0}
          text='Book this seat'
          onPress={bookThisSeat} Icon={null} />
      </View>
    </View>
  )
}

export default RoomCard