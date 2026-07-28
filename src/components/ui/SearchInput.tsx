import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Search } from 'lucide-react-native'
import { Colors } from '../../constant/colors'

const SearchInput = () => {
  return (
    <View style={{
      height: 48,
      width: '100%',
      borderRadius: 100,
      elevation: 2,
      backgroundColor: 'white',
      // paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    }}>
      <Search color={Colors.ICON_GRAY} />
      <TextInput placeholder='Search your place' style={
        {
          // fontSize: 16,
          color: 'black',
          // height: 24,
          backgroundColor: 'white'
        }
      } />
    </View>
  )
}

export default SearchInput