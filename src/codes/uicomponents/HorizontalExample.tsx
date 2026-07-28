import { View, Text, FlatList } from 'react-native'
import React from 'react'

const HorizontalList = () => {

  const fruits = ["Apple", "Banana", "Mango", "Pineapple", "Strawberry", "Pears", "Cherry", "Green Apple", "Kiwi", "Carrot", "Tomato"];

  return (
    <View>
      <FlatList
        data={fruits}
        horizontal
        renderItem={(dt) => {
          return (
            <Text style={
              {
                fontSize: 50,
                borderWidth: 1,//Seperator
                padding: 10,
              }
            }>{dt.index + " - " + dt.item}</Text>
          )
        }}
        keyExtractor={(item) => item}
      />
    </View>
  )
}

export default HorizontalList