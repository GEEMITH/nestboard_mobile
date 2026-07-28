import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react-native'
import { Colors } from '../../constant/colors'

type Props = {
  password: string,
  setPassword?: ((text: string) => void) | undefined,
  placeholder: string
}

const PasswordField = ({
  password,
  setPassword,
  placeholder
}: Props) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Lock size={18} color="#9CA3AF" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
        {showPassword
          ? <EyeOff size={18} color="#9CA3AF" />
          : <Eye size={18} color="#9CA3AF" />}
      </TouchableOpacity>
    </View>
  )
}

export default PasswordField

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
  input: { flex: 1, fontSize: 14, color: '#111827' },
})