import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'

const TextInputExample = () => {

  const [name, setName] = useState<string>("")
  const [num1, setNum1] = useState<string>("123")
  const [num2, setNum2] = useState<string>("456")

  const displayMessage = useCallback(() => {
    Alert.alert("Welcome " + name);
  }, [name])

  const clearMessage = useCallback(() => { // "12" -> 12
    // "1.25" --> 1.25
    setName("")
    // Alert.alert("", (parseInt(num1) + parseInt(num2)) + "") //to convert to int
    // Alert.alert("", (parseFloat(num1) + parseFloat(num2)) + "") //to convert to floating points
  }, [])

  return (
    <View>
      <View style={styles.upperRow}>
        {/* Text input to get the name */}
        <TextInput value={name} onChangeText={(value) => {
          setName(value) //Assign the typed value to name using setName
        }} placeholder='Enter your name' style={styles.textInput} />

        {/* Clear Button */}
        <TouchableOpacity onPress={clearMessage} style={styles.clearMessage}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700'
          }
          }>Clear</Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity onPress={displayMessage} style={styles.displayMessage}>
        <Text style={{
          fontSize: 20,
          fontWeight: '700'
        }
        }>Display</Text>
      </TouchableOpacity>
      <Text style={styles.lengthDisplay}>{name.length}</Text>
    </View>
  )
}

export default TextInputExample

const styles = StyleSheet.create({
  upperRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 100,
    margin: 20,
    paddingLeft: 20,
    fontSize: 20,
    flex: 1
  },
  clearMessage: {
    width: 100,
    height: 50,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20
  },
  displayMessage: {
    width: '100%',
    height: 50,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lengthDisplay: {
    fontSize: 60,
    fontWeight: '700',
    fontStyle: 'italic',
    margin: 50
  }
})