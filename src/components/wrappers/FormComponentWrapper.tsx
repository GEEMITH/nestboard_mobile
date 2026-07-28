import { View, Text, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'

type Props = {
  title: string,
  children: ReactNode
}

const FormComponentWrapper = ({
  title,
  children
}: Props) => {
  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.inputWrapper}>
        {children}
      </View>
    </View>
  )
}

export default FormComponentWrapper

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 16,
    marginTop: 5
  },
})