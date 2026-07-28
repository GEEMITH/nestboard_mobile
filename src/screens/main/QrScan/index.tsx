import { View, Text, Linking } from 'react-native'
import React, { useEffect, useRef } from 'react'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';


const QrScan = () => {

  const device = useCameraDevice('back');

  const link = useRef("");

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);
  //nestboard://property/e203d2f5-dd48-4955-9a95-7ede5262d363
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        if (link.current == "") {
          link.current = codes[0].value + "";
          console.log('Scanned value:', link.current);
          Linking.openURL(link.current)
        }
        // console.log('Scanned value:', codes[0].value);
        // handle the scanned value here
      }
    },
  });

  if (!hasPermission) return <Text>Camera permission required</Text>;
  if (device == null) return <Text>No camera device found</Text>;

  return (
    <Camera
      style={{ flex: 1 }}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  )
}

export default QrScan