import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import React from 'react'
import { ArrowLeft, Bell, Heart } from 'lucide-react-native'
import { Colors } from '../../../../constant/colors'
import RoundButton from '../../../../components/ui/RoundButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { logout } from '../../../../store/authSlice'
import { removeRefreshToken } from '../../../../util/localStorage'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '../../../../components/ui/Typography'


const ConfirmScreenHeader = () => {

  const nav: any = useNavigation();
  const dispatch = useDispatch();
  const gap = useSafeAreaInsets();

  return (
    <View style={[styles.container, {
      paddingTop: gap.top,
    }]}>
      <RoundButton
        Icon={<ArrowLeft color={Colors.SECONDARY_COLOR} size={20} />}
        onPress={() => {
          nav.goBack();
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Typography variant='h2' >{"Confirm booking"}</Typography>
      </View>
    </View>
  )
}

export default ConfirmScreenHeader

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  },
  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  }
})