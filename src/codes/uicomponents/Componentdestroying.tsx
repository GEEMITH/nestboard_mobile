import { View, Text, Button } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const ComponentA = () => {

  useEffect(() => {
    console.log("Component A is there")
    return () => {
      console.log("Component A is no more") // this will execute when the component is being destroyed
    }
  }, [])

  return (
    <Text>Hello A</Text>
  )
}

const Componentdestroying = () => {

  const [enable, setEnable] = useState(false);
  const [step, setStep] = useState(1);

  const x = useMemo(() => 2000 * step, [step]);

  const printSteps = useCallback(() => {
    console.log("step " + step)
  }, [step])

  return (
    <View>
      {
        enable && <ComponentA />
      }
      <Button title='Click' onPress={() => {
        if (enable) {
          setEnable(false);
        } else {
          setEnable(true)
        }
      }} />
      <Button title='Increase Steps' onPress={() => {
        setStep(step + 1)
      }} />
      <Button title='Print Step' onPress={() => {
        printSteps();
      }} />
      <Text style={{ fontSize: 30 }}>{x + " " + step}</Text>
    </View>
  )
}

export default Componentdestroying