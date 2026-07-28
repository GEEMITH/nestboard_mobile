import { View } from "react-native"

export const Alignments = () => {
  return (
    <View style={
      {
        flex: 1,
        padding: 50
      }
    }>
      <View style={{
        width: 200, height: 200, backgroundColor: 'blue',
        borderLeftWidth: 20,
        borderTopWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 20,
        borderLeftColor: 'red',
        borderTopColor: 'red',
        borderRightColor: 'green',
        borderBottomColor: 'green',
        borderStyle: 'solid', //dashed , dotted,
        borderTopLeftRadius: '50%',
        borderBottomRightRadius: '50%'
      }}>
      </View>
    </View>
  )
}