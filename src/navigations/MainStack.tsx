import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthStack from './AuthStack'
import AppStack from './AppStack'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Stack = createNativeStackNavigator()

const MainStack = () => {

  const isAuth = useSelector((st: RootState) => st.auth.isAuthenticated)

  useEffect(() => {
    console.log("IS auth", isAuth)
  }, [isAuth])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      {
        isAuth ?
          <Stack.Screen name='AppStack' component={AppStack} />
          :
          <Stack.Screen name='AuthStack' component={AuthStack} />
      }
    </Stack.Navigator>
  )
}

export default MainStack