import React, {
  useEffect,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import {
  House,
} from 'lucide-react-native';

import {
  Colors,
} from '../../constant/colors';

import Typography
  from '../../components/ui/Typography';

type Props = {
  onReady?: () => void;
};

const SplashScreen = ({
  onReady,
}: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReady?.();
    }, 1500);

    return () =>
      clearTimeout(timer);
  }, [onReady]);

  return (
    <View style={styles.container}>
      <House
        size={60}
        color={Colors.WHITE}
      />

      <Typography
        variant="h1"
        color={Colors.WHITE}
        style={styles.logo}
      >
        NestBoard
      </Typography>

      <ActivityIndicator
        size="large"
        color={Colors.WHITE}
        style={styles.loader}
      />

      <Typography
        variant="body"
        color={Colors.WHITE}
        style={styles.message}
      >
        Loading NestBoard...
      </Typography>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    marginTop: 16,
  },

  loader: {
    marginTop: 32,
  },

  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});