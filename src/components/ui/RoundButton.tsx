import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/colors'
import { Bell } from 'lucide-react-native'

type Props = {
  Icon: any,
  orangeIndicator?: boolean,
  onPress?: ((event: GestureResponderEvent) => void) | undefined
}

const RoundButton = ({ Icon, orangeIndicator, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={
      {
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        borderRadius: 100,
        backgroundColor: 'white',
        elevation: 5,
      }
    }>
      {
        orangeIndicator &&
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 10,
          backgroundColor: Colors.PRIMARY_COLOR,
          position: 'absolute',
          top: 8,
          right: 8
        }}></View>
      }
      {Icon}
      {/* <Bell color={Colors.SECONDARY_COLOR} size={20} /> */}
    </TouchableOpacity>
  )
}

export default RoundButton