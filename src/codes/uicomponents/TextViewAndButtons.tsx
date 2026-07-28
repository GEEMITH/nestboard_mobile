import { Button, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'

let number = 0;

const TextViewAndButtons = () => {

  //Regular variable
  let num1 = 0; /// --> Reset

  //State
  const [num, setNum] = useState(0); /// --> Not Reset, when Change component will be re-rendered

  //Ref variable
  const num2 = useRef(0) /// --> Not reset, when Change component WILL NOT be re-rendered
  //when a State variable changes = Component Re render
  //When a component re - render = the state variables can be without getting reset

  const incrementNumber = () => {
    number = number + 1
    num2.current = num2.current + 1
    // 0 + 1 = 1
    setNum(num + 1)
  }

  const decrementNumber = () => {
    number = number - 1
    // 0 + 1 = 1
    setNum(num - 1)
  }

  return (
    <View>
      <Text style={
        {
          fontSize: 60,
          fontWeight: '700',
          fontStyle: 'italic',
          margin: 50
        }
      }>{num + " " + num2.current}</Text>
      <TouchableOpacity onPress={incrementNumber} style={
        {
          width: '100%',
          height: 50,
          backgroundColor: 'orange',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }>
        <Text style={
          {
            fontSize: 20,
            fontWeight: '700'
          }
        }>Increment</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={decrementNumber} style={
        {
          width: '100%',
          height: 50,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }>
        <Text style={
          {
            fontSize: 20,
            fontWeight: '700'
          }
        }>Decrement</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TextViewAndButtons