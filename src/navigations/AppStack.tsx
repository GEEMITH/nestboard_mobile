import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import TabScreens
  from './TabNavigation/TabScreens';

import PropertyDetails
  from '../screens/main/PropertyDetails';

import RoomTypeDetails
  from '../screens/main/RoomList';

import ConfirmBooking
  from '../screens/main/ConfirmBooking';

import QrScan
  from '../screens/main/QrScan';

import MyBookings
  from '../screens/main/MyBookings';

import PropertyReviews
  from '../screens/main/PropertyReviews';

import Notifications
  from '../screens/main/Notifications';

const Stack =
  createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Tab"
        component={TabScreens}
      />

      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetails}
      />

      <Stack.Screen
        name="RoomTypeDetails"
        component={RoomTypeDetails}
      />

      <Stack.Screen
        name="ConfirmBooking"
        component={ConfirmBooking}
      />

      <Stack.Screen
        name="MyBookings"
        component={MyBookings}
      />

      <Stack.Screen
  name="Notifications"
  component={Notifications}
/>

      <Stack.Screen
        name="QrScan"
        component={QrScan}
      />

      <Stack.Screen
        name="PropertyReviews"
        component={PropertyReviews}
      />
    </Stack.Navigator>
  );
};

export default AppStack;