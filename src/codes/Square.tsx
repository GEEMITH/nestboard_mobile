import { View } from "react-native"

type Props = {
  size: number,
  color?: string
}

export const Square = ({
  size,
  color
}: Props) => {
  return (
    <View style={
      {
        width: size,
        height: size,
        backgroundColor: color ? color : 'blue',
      }
    }>

    </View>
  )
}