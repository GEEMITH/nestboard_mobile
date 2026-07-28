import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, Image, DimensionValue, Dimensions, ScrollView } from 'react-native'
import React, { ReactNode } from 'react'
import { Colors } from '../../../../constant/colors'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PropertyHeader from './Header'
import { Star } from 'lucide-react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'
import Skeleton from '../../../../components/ui/Skeleton'

type Props = {
  children: ReactNode,
}

const ScreenWrapper = ({
  children,
}: Props) => {

  const insets = useSafeAreaInsets();
  const currentProperty = useSelector((state: RootState) => state.property.currentProperty)

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.imageContainer, {
          paddingBottom: insets.bottom
        }]} >
          {/* Top content */}
          {
            currentProperty ?
              <View style={styles.imageAbsoluteContainer}>
                <Image resizeMode="cover" style={styles.topImage} source={
                  {
                    uri: currentProperty.imageUrl
                  }
                } />
              </View>
              :
              <Skeleton style={styles.imageAbsoluteContainer} />
          }
          {/* Form content */}
          {children}
        </View>
        {/* Rating component */}
        <View style={styles.ratingContainer}>
          <Star color={Colors.PRIMARY_COLOR} />
          <Text style={styles.ratingText}>{currentProperty?.rating}</Text>
        </View>

        {/* Header */}
        <PropertyHeader />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ScreenWrapper


const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { flex: 1, justifyContent: 'flex-end', },
  imageAbsoluteContainer: {
    position: 'absolute',
    width: '100%',
    height: '45%',
    top: 0,
  },
  topImage: {
    width: '100%', height: Dimensions.get('window').height * 0.45
  },
  gradientContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  },
  subTitle: {
    marginHorizontal: 100,
    textAlign: 'center', color: '#393939',
    marginTop: 5
  },
  ratingContainer: {
    backgroundColor: 'white',
    height: 36,
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    right: 16,
    top: (Dimensions.get('window').height * 0.45) - 100,
    gap: 6
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600'
  },
});