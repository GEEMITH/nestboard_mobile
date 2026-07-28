import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useMemo } from 'react'
import { PropertyItem as PItem } from '../../../../types/properties';
import PropertyItemSkeleton from './PropertyItemSkeleton';
import PropertyItem from './PropertyItem';
import Typography from '../../../../components/ui/Typography';
import { FileQuestionMark } from 'lucide-react-native';
import { Colors } from '../../../../constant/colors';

// const Properties = [
//   {
//     id: "1",
//     title: "Ocean View Villa",
//     location: "Mirissa, Sri Lanka",
//     type: "Villa",
//     price: "$350",
//     rating: 4.9,
//     image: "https://images.pexels.com/photos/28463539/pexels-photo-28463539.jpeg",
//     lat: 5.9485,
//     lng: 80.4716,
//   },
//   {
//     id: "2",
//     title: "Luxury City Apartment",
//     location: "Colombo, Sri Lanka",
//     type: "Apartment",
//     price: "$120",
//     rating: 4.7,
//     image: "https://images.pexels.com/photos/28463543/pexels-photo-28463543.jpeg",
//     lat: 6.9271,
//     lng: 79.8612,
//   },
// ]

type Props = {
  properties: PItem[],
  fetchNextBatch: () => void,
  fetching: boolean
}

const PropertyList = ({
  fetchNextBatch, fetching, properties
}: Props) => {

  const height = 320;

  const styles_ = useMemo(() => styles(height), [height]);

  return (
    <View style={styles_.flexContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles_.flexContainer}
        ItemSeparatorComponent={() => <View style={{ height: 16 }}></View>}
        data={properties}
        keyExtractor={(data) => data.id}
        renderItem={(dt) => <PropertyItem dt={dt} />}
        ListEmptyComponent={() => {
          return (
            (fetching) ?
              <>
                <PropertyItemSkeleton />
                <View style={{ height: 16 }}></View>
                <PropertyItemSkeleton />
              </>
              :
              <View style={
                {
                  width: '100%',
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }>
                <FileQuestionMark color={Colors.ICON_GRAY} size={100} />
                <Typography>No properties found</Typography>
              </View>
          )
        }}
        // ListFooterComponent={(fetching) ? () => <PropertyItemSkeleton /> : null}
        ListFooterComponent={(fetching) ? () =>
          <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View> : null}
        contentContainerStyle={
          {
            paddingBottom: 140
          }
        }
        onEndReached={fetchNextBatch}
        onEndReachedThreshold={0.5}//0 - 0.5
      />
    </View>
  )
}

export default PropertyList

export const styles = (height: number) => StyleSheet.create({
  propertContainer: {
    borderRadius: 16,
    width: '100%',
    height: height,
    overflow: 'hidden'
  },
  ratingContainer: {
    backgroundColor: 'white',
    height: 36,
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    right: 16,
    top: 16,
    gap: 6
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600'
  },
  gradientBackground: {
    flexDirection: 'row',
    backgroundColor: '#00000090',
    padding: 24,
    justifyContent: 'space-between'
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end'
  },
  flexContainer: {
    flex: 1
  }
})