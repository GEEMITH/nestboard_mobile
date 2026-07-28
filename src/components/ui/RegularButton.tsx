import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/colors'

type Props = {
  Icon: any,
  text: string,
  loading?: boolean,
  disable?: boolean,
  variant?: 'solid' | 'outline',
  onPress: () => void,
  marginTop?: number
}

const RegularButton = ({ Icon, text, onPress, loading, marginTop, variant, disable }: Props) => {
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onPress} style={[styles.container, {
        marginTop,
        backgroundColor: (variant == 'outline') ? Colors.WHITE : (disable) ? Colors.ICON_GRAY : Colors.PRIMARY_COLOR,
        elevation: (variant == 'outline') ? 0 : 2,
        borderWidth: (variant == 'outline') ? 1 : 0,
        borderColor: (variant == 'outline') ? 'black' : 'auto',
      }]}>
      {
        loading ?
          <ActivityIndicator color={Colors.WHITE} />
          :
          <>
            {Icon}
            <Text style={[styles.text, {
              color: (variant == 'outline') ? 'black' : 'white',
            }]}>{text}</Text>
          </>
      }
    </TouchableOpacity>
  )
}

export default RegularButton

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 24,
    borderColor: Colors.PRIMARY_COLOR,
    gap: 8
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  }
})