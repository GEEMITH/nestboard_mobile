import { View, Text, Image } from 'react-native'
import React from 'react'

export default function ImageExample() {
  return (
    <View>
      <Image
        source={require('./../assets/images/monkey.jpg')}
        resizeMode='cover'
        style={
          {
            width: 300,
            height: 300
          }
        }
      />
      <Image
        source={
          {
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFH6wVQiyNAj5KJYkcKXvocB-aILcknKTv1PAGz7PtmW1PCqvUbBBu3lZ9o-YcSW_5IIOx9lINscrp8JiCh84HV1onsFz6lP-FfOu_pg&s=10"
          }
        }
        resizeMode='cover'
        style={
          {
            width: 300,
            height: 300
          }
        }
      />
    </View>
  )
}