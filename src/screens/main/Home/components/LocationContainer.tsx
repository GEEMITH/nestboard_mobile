import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../../../../constant/colors'

const LocationContainer = () => {

  return (
    <View style={styles.container}>
      {/* Avatar Image */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>JD</Text>
      </View>

      {/* Location part */}
      <View>
        <Text style={{ fontSize: 12, color: Colors.TEXT_GRAY }}>Location</Text>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Colombo, Sri Lanka</Text>
      </View>
    </View>
  )
}

export default LocationContainer

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.AVATAR_BACKGROUND,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white'
  }
})