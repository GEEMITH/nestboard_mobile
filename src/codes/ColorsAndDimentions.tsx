import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { styles } from './stylesheet1'

const ColorsAndDimentions = () => {

  const margin = 30;

  return (
    <View>
      <View style={
        {
          width: 100,
          height: 100,
          backgroundColor: '#ff0000'//0 -255(R), 0 - 255(G), 0-255(B)
          //#000000
          //#FFFFFF
          //#FFFF00
        }
      }>

      </View>
      <View style={styles.blueBox}>
        <View style={[
          styles.yellowBox,
          {
            margin: margin
          }
        ]}></View>
      </View>
    </View>
  )
}

export default ColorsAndDimentions