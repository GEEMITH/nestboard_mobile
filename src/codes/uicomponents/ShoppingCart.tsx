import { View, Text, Image, TouchableOpacity, ImageSourcePropType, FlatList } from 'react-native'
import React, { useState } from 'react'

type Props = {
  itemImage: ImageSourcePropType | undefined,
  itemName: string,
  itemPrice: string
}

const CartItem = ({
  itemImage,
  itemName,
  itemPrice
}: Props) => {

  const [qty, setQty] = useState(1);

  const incrementQty = () => {
    setQty(qty + 1)
  }

  const decrementQty = () => {
    if (qty > 0) {
      setQty(qty - 1)
    }
  }

  return (
    <View style={{ flexDirection: 'row', padding: 5, gap: 10 }}>

      {/* Image */}
      <Image source={itemImage} style={
        {
          width: 150,
          height: 250
        }
      } />

      {/* Item description part (Middle part)*/}
      <View style={{ flex: 1, }}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 15 }}>{itemName}</Text>
        <Text style={{ fontSize: 18, marginTop: 15 }}>QTY: {qty}</Text>
        {/* Two buttons to change the QTY */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>

          {/* Minus Button */}
          <TouchableOpacity onPress={decrementQty} style={{
            width: 60, height: 40, backgroundColor: '#aaaaaa',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{ fontSize: 25 }}>-</Text>
          </TouchableOpacity>

          {/* Plus Button */}
          <TouchableOpacity onPress={incrementQty} style={{
            width: 60, height: 40, backgroundColor: '#ff4d00',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{ fontSize: 25 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ fontSize: 20, fontWeight: '700', textAlignVertical: 'center' }}>{itemPrice}</Text>

    </View>
  )
}



const ShoppingCart = () => {

  const cartItems = [

    {
      id: '2',
      image: require('../assets/images/milo.jpg'),
      imageCount: 2,
      name: "Milo",
      price: "$15"
    },
    {
      id: '3',
      image: require('../assets/images/cheese.png'),
      name: "Cheese",
      imageCount: 0,
      price: "$10"
    },
    {
      id: '1',
      image: require('../assets/images/salmon.jpeg'),
      name: "Salmon",
      imageCount: 4,
      price: "$25"
    },
    {
      id: '4',
      image: require('../assets/images/monkey.jpg'),
      name: "Monkey",
      imageCount: 6,
      price: "Free"
    },
  ]

  const [refreshing, setRefreshing] = useState(false);

  const refreshPage = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Do the API call to retreive the data from backend using APIs
      setRefreshing(false);
    }, 5000)
  }

  return (
    <View>

      <FlatList
        refreshing={refreshing}
        onRefresh={refreshPage}
        // Header of the flat list
        ListHeaderComponent={() =>
          <View style={
            {
              padding: 30,
              backgroundColor: 'orange'
            }
          }>
            <Text style={
              {
                fontSize: 30,
                fontWeight: '700',
              }
            }>Cart</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 5, backgroundColor: 'black' }}></View>}
        data={cartItems}
        getItemLayout={(data, index) => {
          if (data) {
            for (let i = 0; i < data.length; i++) {
              const itm = data[i];
              if (itm.name)
                return ({
                  length: (100 * (itm.imageCount / 2)) + 100,           // row height in px
                  offset: (100 * (itm.imageCount / 2)) + 100 * index,  // distance from top
                  index,
                })
            }
          }
          return ({
            length: 100,           // row height in px
            offset: 100 * index,  // distance from top
            index,
          })
        }}
        renderItem={(dt) => {
          return (
            <CartItem
              itemName={dt.item.name}
              itemPrice={dt.item.price}
              itemImage={dt.item.image} />
          )
        }}
        keyExtractor={(item, index) => index + ""}
        ListFooterComponent={() =>
          <View style={
            {
              padding: 30,
              backgroundColor: 'yellow',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }
          }>
            <Text style={
              {
                fontSize: 30,
                fontWeight: '700',
              }
            }>Total</Text>
            <Text style={
              {
                fontSize: 30,
                fontWeight: '700',
              }
            }>$50</Text>
          </View>
        }
      />
    </View>
  )
}

export default ShoppingCart