import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/colors'

type Props = {
  Icon: any,
  text: string,
  selected?: boolean
  onPress: () => void
}

const SwitchButton = ({ Icon, text, onPress, selected }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={{
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      elevation: 2,
      backgroundColor: (selected) ? Colors.PRIMARY_COLOR : 'white',
      paddingHorizontal: 24,
      gap: 8
    }}>
      {Icon}
      <Text style={
        {
          fontSize: 16,
          fontWeight: '500',
          color: (selected) ? 'white' : 'black'
        }
      }>{text}</Text>
    </TouchableOpacity>
  )
}

export default SwitchButton