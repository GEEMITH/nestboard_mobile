import { View, Text } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/colors'
import { House } from 'lucide-react-native'

const SplashScreen = () => {
  return (
    <View style={
      {
        flex: 1,
        backgroundColor: Colors.PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
      }
    }>
      <House size={60} color={'white'} />
    </View>
  )
}

export default SplashScreen