import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

const Hooks = () => {

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    console.log("Component is being initialized");
  }, [])// This will execute on the component is being crated

  useEffect(() => {
    console.log("Hello " + x);
  }, [x]) //If any member of this list 
  // were the reason to the re render of this component
  // This use effect will be executed

  useEffect(() => {
    console.log("On every rendering circles");
  }) // This will execute on every rendering circles

  useEffect(() => {
    console.log("On every rendering circles");
    return () => {
      console.log("Destroyed")
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Button title='Click' onPress={() => {
        setY(y + 1)
      }} />
    </View>
  )
}

export default Hooks