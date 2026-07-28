import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native'
import React from 'react'
import { Search } from 'lucide-react-native'
import { Colors } from '../../constant/colors'

type Props = {
  Icon: any,
  placeholder: string,
  keyboardType?: KeyboardTypeOptions | undefined;
  value: string | undefined,
  onChangeText?: ((text: string) => void) | undefined
}

const IconInput = ({
  Icon,
  placeholder,
  keyboardType,
  value,
  onChangeText
}: Props) => {
  return (
    <View style={styles.container}>
      <Icon size={18} color="#9CA3AF" />
      <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={placeholder} style={styles.input} />
    </View>
  )
}

export default IconInput

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: '100%',
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.BORDER_GRAY,
    // paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  input: {
    // fontSize: 16,
    color: 'black',
    // height: 24,
    backgroundColor: 'white'
  }
})