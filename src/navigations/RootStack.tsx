import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/splash'
import AuthStack from './AuthStack'
import { checkStatus } from '../util/localStorage'
import MainStack from './MainStack'
import { useDispatch } from 'react-redux'
import { initAuth } from '../store/authSlice'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'

const Stack = createNativeStackNavigator()

//nestboard://property/897a4dd4-6268-4fdb-950d-98a11b2f2e6b
//nestboard://profile/user/123
const linking: LinkingOptions<any> = {
  prefixes: ['nestboard://'],
  config: {
    screens: {
      MainStack: {
        screens: {
          AppStack: {
            screens: {
              PropertyDetails: 'property/:pid',
              Profile: 'profile/user/:id'
            },
          },
        },
      },
    },
  },
}


const RootStack = () => {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {

      checkStatus().then(refreshToken => {
        if (refreshToken) {
          dispatch(initAuth({
            refreshToken: refreshToken
          }))
        }
        setLoading(false);
      })

    }, 500)
  }, [])

  if (loading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={
        {
          headerShown: false
        }
      }
      >
        <Stack.Screen name='MainStack' component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default RootStack