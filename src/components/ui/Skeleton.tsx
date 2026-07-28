import React, { ReactNode, useEffect } from 'react';
import { DimensionValue, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
  backgroundColor?: string,
  children?: ReactNode
}

const Skeleton = ({ width = '100%', height = 16, style, children, backgroundColor }: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.base,
  {
    width, height, backgroundColor: (backgroundColor) ? backgroundColor : '#E5E7EB',
  }, animatedStyle, style]} >{children}</Animated.View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
  },
});

export default Skeleton;
