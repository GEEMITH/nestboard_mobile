import { View, Text, TouchableOpacity, ListRenderItemInfo, ImageBackground } from 'react-native'
import React, { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native';
import { styles } from './PropertyList';
import LinearGradient from 'react-native-linear-gradient';
import { Star } from 'lucide-react-native';
import { Colors } from '../../../../constant/colors';
import { PropertyItem as PItem } from '../../../../types/properties';

type Props = {
  dt: ListRenderItemInfo<PItem>
}

export const PropertyItem = ({ dt }: Props) => {

  const height = 320;

  const nav: any = useNavigation();
  const styles_ = useMemo(() => styles(height), [height]);

  return (
    <TouchableOpacity onPress={() => {
      nav.navigate('PropertyDetails', {
        pid: dt.item.id
      })
    }} style={styles_.propertContainer}>
      <ImageBackground style={styles_.imageBackground} source={
        {
          uri: dt.item.image
        }
      }>
        <LinearGradient style={styles_.gradientBackground}
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,255)']}>
          <View>
            <Text style={{ color: 'white', fontSize: 12, letterSpacing: 0.6 }}>{dt.item.type}</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{dt.item.title}</Text>
            <Text style={{ color: 'white' }}>{dt.item.location}</Text>
          </View>
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{dt.item.price}</Text>
            <Text style={{ color: 'white' }}>{"Month"}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View style={styles_.ratingContainer}>
        <Star color={Colors.PRIMARY_COLOR} />
        <Text style={styles_.ratingText}>{dt.item.rating}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default PropertyItem