import { View, Text, TouchableOpacity, ListRenderItemInfo, ImageBackground } from 'react-native'
import React, { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native';
import { styles } from './PropertyList';
import LinearGradient from 'react-native-linear-gradient';
import { Star } from 'lucide-react-native';
import { Colors } from '../../../../constant/colors';
import { PropertyItem as PItem } from '../../../../types/properties';
import Skeleton from '../../../../components/ui/Skeleton';

export const PropertyItemSkeleton = () => {

  const height = 320;

  const nav: any = useNavigation();
  const styles_ = useMemo(() => styles(height), [height]);

  return (
    <Skeleton height={height} width={'100%'} style={{
      justifyContent: 'flex-end'
    }} >
      <Skeleton style={styles_.ratingContainer} width={60} />
      <View style={
        {
          flexDirection: 'row',
          padding: 24,
          justifyContent: 'space-between'
        }
      }>
        <View style={{ gap: 8 }}>
          <Skeleton height={20} width={80} backgroundColor={'#cbcbcb'} />
          <Skeleton height={25} width={200} backgroundColor={'#cbcbcb'} />
          <Skeleton height={15} width={80} backgroundColor={'#cbcbcb'} />
        </View>
        <View style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end', gap: 8
        }}>
          <Skeleton height={30} width={100} backgroundColor={'#cbcbcb'} />
          <Skeleton height={20} width={80} backgroundColor={'#cbcbcb'} />
        </View>
      </View>
    </Skeleton>
  )
}

export default PropertyItemSkeleton