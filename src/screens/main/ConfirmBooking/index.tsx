import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import ConfirmScreenHeader from './components/Header'
import Typography from '../../../components/ui/Typography'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import RegularButton from '../../../components/ui/RegularButton'
import { Lock } from 'lucide-react-native'
import { BookingAPI } from '../../../api/bookings'
import { Colors } from '../../../constant/colors'
import { Picker } from '@react-native-picker/picker';

import dayjs from 'dayjs'
import { formatNumberIntoCurrency } from '../../../util/common'

const Months: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const currentYear = new Date().getFullYear();

const Years: number[] = [currentYear, currentYear + 1, currentYear + 2]

const ConfirmBooking = () => {

  const currentProperty = useSelector((state: RootState) => state.property.currentProperty);
  const roomId = useSelector((state: RootState) => state.booking.data?.roomId);
  const data = useSelector((state: RootState) => state.booking.data);
  const roomName = useSelector((state: RootState) => state.booking.data?.roomName);
  const seatIndex = useSelector((state: RootState) => state.booking.data?.seatIndex);
  const pricePerSeat = useSelector((state: RootState) => state.booking.data?.pricePerSeat);

  const [date, setDate] = useState("2026-07")
  const [duration, setDuration] = useState(0)

  const [fromDate, setFromDate] = useState(Years[0] + "-" + Months[0]);
  const [toDate, setToDate] = useState(Years[0] + "-" + Months[0]);

  //2026,2027,2028



  console.log(data)

  const total = useMemo(() => (parseFloat(pricePerSeat + "") * duration).toFixed(2), [pricePerSeat, duration])

  const [booking, setBooking] = useState(false);

  const bookNow = async () => {
    setBooking(true);
    console.log(roomId)
    console.log(seatIndex)
    if (roomId && seatIndex) {
      await BookingAPI.bookProperty(roomId, seatIndex, date, duration, total)
      setBooking(false);
    }
  }

  useEffect(() => {
    if (fromDate && toDate) {
      const sd = dayjs(fromDate, 'YYYY-MMM');
      const td = dayjs(toDate, 'YYYY-MMM');
      console.log("difference ", td.diff(sd, 'month'))
      const diff = td.diff(sd, 'month');
      if (diff < 0) {
        setToDate(fromDate)
      } else {
        setDuration(td.diff(sd, 'month'))
      }
    }
  }, [fromDate, toDate])

  //YYYY-MMM

  return (
    <View style={{
      backgroundColor: Colors.WHITE,
      padding: 16,
      flex: 1,
      gap: 16
    }}>
      <ConfirmScreenHeader />
      <View style={
        {
          padding: 20,
          elevation: 1,
          borderRadius: 16,
          backgroundColor: Colors.WHITE,
          gap: 24,
          marginBottom: 8
        }
      }>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>{"Property"}</Typography>
          <Typography variant='h3'>{currentProperty?.title}</Typography>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>{"Room"}</Typography>
          <Typography variant='h3'>{roomName}</Typography>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>{"Seat"}</Typography>
          <Typography variant='h3'>{seatIndex}</Typography>
        </View>

        <View style={{ justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>{"Lease Period"}</Typography>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 }}>
            {/* From date */}
            <Picker
              selectedValue={fromDate}
              style={{ backgroundColor: '#eee', width: '40%' }}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) =>
                setFromDate(itemValue)
              }>
              {
                Years.map(year =>
                  Months.map(month =>
                    <Picker.Item label={year + "-" + month} value={year + "-" + month} />
                  )
                )
              }
            </Picker>
            <Typography variant='h1'> - </Typography>
            {/* To date */}
            <Picker
              selectedValue={toDate}
              style={{ backgroundColor: '#eee', width: '40%' }}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) =>
                setToDate(itemValue)
              }>
              {
                Years.map(year =>
                  Months.map(month =>
                    <Picker.Item label={year + "-" + month} value={year + "-" + month} />
                  )
                )
              }
            </Picker>
          </View>
        </View>
        <View style={{ height: 0.5, backgroundColor: Colors.BORDER_GRAY }}></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>{"Price\nBreakdown"}</Typography>
          <Typography variant='body' color={Colors.TEXT_GRAY}>{
            formatNumberIntoCurrency(parseFloat(pricePerSeat + "")) + " x " + duration + "\nmonths"
          }</Typography>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='h1'>{"Total"}</Typography>
          <Typography variant='h1'>{formatNumberIntoCurrency(parseFloat(total))}</Typography>
        </View>
      </View>
      <RegularButton Icon={<Lock color={'white'} />} loading={booking} onPress={bookNow} text={'Pay LKR ' + total} />
      <Typography variant='caption' style={{ textAlign: 'center' }}>Full payment is required upfront for the entire</Typography>
    </View>
  )
}

export default ConfirmBooking