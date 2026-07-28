import { View, Text, KeyboardAvoidingView, Platform, Image, StyleSheet, DimensionValue } from 'react-native'
import React, { ReactNode } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constant/colors';

type Props = {
  children: ReactNode,
  heightPrecentage?: DimensionValue | undefined

}

const AuthUIWrapper = ({
  children,
  heightPrecentage
}: Props) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.imageContainer} >
        {/* Top content */}
        <View style={[styles.imageAbsoluteContainer, {
          height: heightPrecentage
        }]}>
          <Image resizeMode="cover" style={styles.topImage} source={
            require('../../assets/images/auth_top_7.png')
          } />
          <LinearGradient style={styles.gradientContainer}
            colors={['#ffffff', '#ffc595b1']}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.nest}>
                Nest
                <Text style={
                  {
                    color: Colors.PRIMARY_COLOR,
                    fontSize: 30,
                    fontWeight: '700',
                  }
                }>Board</Text>
              </Text>
              <Text
                style={styles.subTitle}>
                Find and book comfortable stays with ease.</Text>
            </View>
          </LinearGradient>
        </View>
        {/* Form content */}
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}

export default AuthUIWrapper;

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { flex: 1, justifyContent: 'flex-end', },
  imageAbsoluteContainer: {
    position: 'absolute',
    width: '100%',
    top: 0
  },
  topImage: { width: '100%', height: '100%' },
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
  }
});