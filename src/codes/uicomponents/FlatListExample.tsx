import { View, Text, FlatList } from 'react-native'
import React from 'react'

const FlatListExample = () => {

  const fruits = ["Apple", "Banana", "Mango", "Pineapple", "Strawberry", "Pears", "Cherry", "Green Apple", "Kiwi", "Carrot", "Tomato"];

  return (
    <View>
      <View style={{
        height: 8,
        width: '90%',
        margin: 10,
        backgroundColor: "#dadada",
        borderRadius: 16
      }}>
        <View style={{
          height: 8,
          width: '60%',
          backgroundColor: "#E8652A",
          borderRadius: 16
        }}>

        </View>
      </View>
      <FlatList
        data={fruits}
        numColumns={2}// Define how many columns should be in a single row
        renderItem={(dt) => {
          return (
            <Text style={
              {
                fontSize: 50,
                borderWidth: 1,//Seperator
                padding: 10,
                width: '50%'
              }
            }>{dt.index + " - " + dt.item}</Text>
          )
        }}
        keyExtractor={(item) => item}
      />
    </View>
  )
}

export default FlatListExample