import { View, Text, FlatList } from 'react-native'
import React from 'react'

const ListPerformance = () => {

  const fruits = ["Apple", "Banana", "Mango", "Pineapple", "Strawberry", "Pears", "Cherry", "Green Apple", "Kiwi", "Carrot", "Tomato"];

  return (
    <View>
      <FlatList
        data={fruits}
        initialNumToRender={5}
        windowSize={3} //1 +1 + 1
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => {
          data
          return ({
            length: 100,           // row height in px
            offset: 100 * index,  // distance from top
            index,
          })
        }}

        renderItem={(dt) => {
          return (
            <Text style={
              {
                fontSize: 60,
                borderWidth: 1,//Seperator
                padding: 10,
                height: 100
              }
            }>{dt.item}</Text>
          )
        }}
        keyExtractor={(item) => item}
      />
    </View>
  )
}

export default ListPerformance