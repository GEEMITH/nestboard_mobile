import { View } from "react-native"

export const FlexBoxExamples = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* First row */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 4, backgroundColor: 'black' }}></View>
        <View style={{ flex: 1, backgroundColor: 'orange' }}></View>
      </View>
      {/* Second row */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 2, backgroundColor: 'purple' }}></View>
        <View style={{ flex: 4, backgroundColor: 'blue' }}></View>
        <View style={{ flex: 3, backgroundColor: 'green' }}></View>
      </View>
      {/* 3rd row */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 4, backgroundColor: 'gray' }}></View>
        <View style={{ flex: 1, backgroundColor: 'black' }}></View>
      </View>
      {/* 4th row */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: 'red' }}></View>
        <View style={{ flex: 1, backgroundColor: 'green' }}></View>
        <View style={{ flex: 1, backgroundColor: 'blue' }}></View>
        <View style={{ flex: 1, backgroundColor: 'yellow' }}></View>
      </View>
      {/* 5th row */}
      <View style={{ flex: 10 }}>
        <View style={{ flex: 1, backgroundColor: 'aqua' }}></View>
        <View style={{ flex: 1, backgroundColor: 'deeppink' }}></View>
      </View>
    </View>
  )
}