import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  useSelector,
} from 'react-redux';

import AuthStack
  from './AuthStack';

import AppStack
  from './AppStack';

import type {
  RootState,
} from '../store/store';

const Stack =
  createNativeStackNavigator();

const MainStack = () => {
  const isAuthenticated =
    useSelector(
      (state: RootState) =>
        state.auth.isAuthenticated,
    );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="AppStack"
          component={AppStack}
        />
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
        />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;