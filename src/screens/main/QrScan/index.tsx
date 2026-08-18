import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

const QrScan = () => {
  const device =
    useCameraDevice('back');

  const isFocused =
    useIsFocused();

  const {
    hasPermission,
    requestPermission,
  } = useCameraPermission();

  const scanned =
    useRef(false);

  useFocusEffect(
    useCallback(() => {
      scanned.current = false;

      return () => {
        scanned.current = false;
      };
    }, []),
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [
    hasPermission,
    requestPermission,
  ]);

  const handleScan =
    useCallback(
      async (value?: string) => {
        if (
          scanned.current ||
          !value
        ) {
          return;
        }

        const trimmedValue =
          value.trim();

        const propertyPattern =
          /^nestboard:\/\/property\/([^/?#]+)\/?$/i;

        const match =
          trimmedValue.match(
            propertyPattern,
          );

        if (!match?.[1]) {
          scanned.current = true;

          Alert.alert(
            'Invalid QR code',
            'This QR code is not a valid NestBoard property link.',
            [
              {
                text: 'Try Again',
                onPress: () => {
                  scanned.current =
                    false;
                },
              },
            ],
          );

          return;
        }

        scanned.current = true;

        try {
          await Linking.openURL(
            trimmedValue,
          );
        } catch {
          scanned.current = false;

          Alert.alert(
            'Unable to open property',
            'Please try scanning the QR code again.',
          );
        }
      },
      [],
    );

  const codeScanner =
    useCodeScanner({
      codeTypes: ['qr'],

      onCodeScanned: codes => {
        if (
          scanned.current ||
          codes.length === 0
        ) {
          return;
        }

        handleScan(
          codes[0]?.value,
        );
      },
    });

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.title}>
          Camera permission required
        </Text>

        <Text style={styles.message}>
          Allow camera access to scan
          NestBoard property QR codes.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={
            requestPermission
          }
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            Allow Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            Linking.openSettings()
          }
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Open Settings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator
          size="large"
        />

        <Text
          style={[
            styles.message,
            {
              marginTop: 16,
            },
          ]}
        >
          Camera not available.
        </Text>
      </View>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isFocused}
      codeScanner={codeScanner}
    />
  );
};

export default QrScan;

const styles =
  StyleSheet.create({
    permissionContainer: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },

    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#111827',
      textAlign: 'center',
    },

    message: {
      fontSize: 15,
      lineHeight: 22,
      color: '#6B7280',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 24,
    },

    primaryButton: {
      width: '100%',
      height: 52,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5662A',
      marginBottom: 12,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },

    secondaryButton: {
      width: '100%',
      height: 52,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#D1D5DB',
    },

    secondaryButtonText: {
      color: '#374151',
      fontSize: 16,
      fontWeight: '600',
    },
  });