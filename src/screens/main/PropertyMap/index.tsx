import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderWithBackButton from '../../../components/ui/headers/HeaderWithBackButton'
import MapView, { Marker } from 'react-native-maps';
import GetLocation, { Location } from 'react-native-get-location'
import MapPinIcon from '../../../assets/svgs/MapPinIcon';
import { PropertyAPI } from '../../../api/properties';
import { PropertyLocation } from '../../../types/properties';
import MyLocationIcon from '../../../assets/svgs/MyLocationIcon';
import PropertiesMakers from './components/PropertiesMakers';
import Typography from '../../../components/ui/Typography';
import { Colors } from '../../../constant/colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constant/dimentions';
import { Star, X } from 'lucide-react-native';
import Animated, { Easing, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const PropertyMap = () => {

  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [properties, setProperties] = useState<PropertyLocation[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<PropertyLocation>();

  const getMyLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log("location", location)
        setCurrentLocation(location)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  const getProperties = () => {
    PropertyAPI.getMapList().then(d => {
      console.log("locations -----> ", d)
      setProperties(d)
    })
  }

  useEffect(() => {
    getMyLocation();
    getProperties();
  }, [])

  const selectProperty = (pro: PropertyLocation) => {
    setSelectedProperty(pro)
    cardComes();
  }

  // Card animation

  const yPos = useSharedValue(SCREEN_HEIGHT)
  const toY = SCREEN_HEIGHT - 240;

  const cardComes = () => {
    yPos.value = withTiming(toY, {
      duration: 500,
      easing: Easing.out(Easing.exp)
    })
  }

  const cardGoesAway = () => {
    yPos.value = withTiming(SCREEN_HEIGHT, {
      duration: 500,
      easing: Easing.out(Easing.exp)
    })
  }

  const cardAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: yPos.value
      }
    ]
  }))

  return (
    <View style={
      {
        flex: 1
      }
    }>
      <HeaderWithBackButton title='' />
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.0535,
          longitude: 80.2210,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {
          properties.length > 0 &&
          <PropertiesMakers properties={properties} selectProperty={selectProperty} />
        }
        {
          currentLocation &&
          <Marker
            zIndex={100}
            coordinate={
              {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
              }
            }
          >
            <MyLocationIcon />
          </Marker>
        }
      </MapView>
      <Animated.View style={[style.cardContainer, cardAnimationStyle]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h2'>{selectedProperty?.name}</Typography>
          <Typography variant='h2' color={Colors.PRIMARY_COLOR}>{selectedProperty?.cost}</Typography>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Typography style={{ width: SCREEN_WIDTH * 0.5 }} variant='h3' color={Colors.TEXT_GRAY}>{selectedProperty?.address}</Typography>
          <View style={style.ratingContainer}>
            <Star fill={Colors.PRIMARY_COLOR} color={Colors.PRIMARY_COLOR} size={12} />
            <Text style={style.ratingText}>{selectedProperty?.ratings}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={cardGoesAway} style={
          {
            width: 40, height: 40, borderRadius: 100, backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            position: 'absolute',
            top: -20,
            right: -10,
            alignItems: 'center',
            justifyContent: 'center'
          }
        }>
          <X />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default PropertyMap

const style = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    zIndex: 100,
    padding: 20,
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: Colors.WHITE,
    gap: 4,
    width: SCREEN_WIDTH - 40
  },
  ratingContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    gap: 6
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600'
  },
})