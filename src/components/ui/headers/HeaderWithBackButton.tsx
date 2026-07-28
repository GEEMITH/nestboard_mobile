import { View, StyleSheet } from 'react-native'
import React from 'react'
import { ArrowLeft } from 'lucide-react-native'
import { Colors } from '../../../constant/colors'
import RoundButton from '../RoundButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '../Typography'

type Props = {
  title: string,
}

const HeaderWithBackButton = ({ title }: Props) => {

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
        <Typography variant='h2' >{title}</Typography>
      </View>
    </View>
  )
}

export default HeaderWithBackButton

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    position: 'absolute',
    zIndex: 100
  },
  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  }
})