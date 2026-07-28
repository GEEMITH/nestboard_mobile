import { View, Text } from 'react-native'
import React from 'react'
import { PropertyLocation } from '../../../../types/properties'
import { Marker } from 'react-native-maps'
import MapPinIcon from '../../../../assets/svgs/MapPinIcon'

type Props = {
  properties: PropertyLocation[],
  selectProperty: (pro: PropertyLocation) => void
}

const PropertiesMakers = ({ properties, selectProperty }: Props) => {
  return (
    properties.map(property =>
      <Marker
        onPress={() => {
          selectProperty(property)
        }}
        centerOffset={
          {
            x: 0,
            y: -22
          }
        }
        title={property.name}
        description={property.address}
        zIndex={10}
        key={property.id}
        coordinate={
          {
            latitude: property.lat,
            longitude: property.lng
          }
        }
      >
        <MapPinIcon />
      </Marker>
    )
  )
}

export default PropertiesMakers