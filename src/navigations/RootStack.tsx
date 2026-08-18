import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Linking,
} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import SplashScreen
  from '../screens/splash';

import MainStack
  from './MainStack';

import {
  checkStatus,
  removeRefreshToken,
  persistLogin,
} from '../util/localStorage';

import {
  saveToken,
} from '../store/authSlice';

import {
  AuthAPI,
} from '../api/auth';

import type {
  RootState,
} from '../store/store';

const Stack =
  createNativeStackNavigator();

export const navigationRef =
  createNavigationContainerRef<any>();

type PendingDestination =
  | {
      type: 'PROPERTY';
      propertyId: string;
    }
  | {
      type: 'MY_BOOKINGS';
    }
  | null;

const RootStack = () => {
  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const [
    apiReady,
    setApiReady,
  ] = useState(false);

  const [
    navigationReady,
    setNavigationReady,
  ] = useState(false);

  const pendingDestination =
    useRef<PendingDestination>(null);

  const dispatch =
    useDispatch();

  const isAuthenticated =
    useSelector(
      (state: RootState) =>
        state.auth.isAuthenticated,
    );

  /*
   * Restore login session.
   *
   * IMPORTANT:
   * The stored refresh token cannot be used
   * as the access token.
   *
   * We must exchange it for a fresh token pair.
   */
  useEffect(() => {
    const restoreSession =
      async () => {
        try {
          const storedRefreshToken =
            await checkStatus();

          if (!storedRefreshToken) {
            return;
          }

          const tokens =
            await AuthAPI.refresh(
              storedRefreshToken,
            );

          dispatch(
            saveToken({
              accessToken:
                tokens.accessToken,
              refreshToken:
                tokens.refreshToken,
            }),
          );

          await persistLogin(
            tokens.refreshToken,
          );
        } catch (error) {
          console.log(
            'Session restore failed:',
            error,
          );

          await removeRefreshToken();
        } finally {
          setAuthLoading(false);
        }
      };

    restoreSession();
  }, [dispatch]);

  const openProperty =
    useCallback(
      (propertyId: string) => {
        if (
          !navigationRef.isReady()
        ) {
          return;
        }

        navigationRef.navigate(
          'MainStack',
          {
            screen: 'AppStack',
            params: {
              screen:
                'PropertyDetails',
              params: {
                pid: propertyId,
              },
            },
          },
        );
      },
      [],
    );

  const openMyBookings =
    useCallback(() => {
      if (
        !navigationRef.isReady()
      ) {
        return;
      }

      navigationRef.navigate(
        'MainStack',
        {
          screen: 'AppStack',
          params: {
            screen:
              'MyBookings',
          },
        },
      );
    }, []);

  const openLogin =
    useCallback(() => {
      if (
        !navigationRef.isReady()
      ) {
        return;
      }

      /*
       * MainStack decides whether to show
       * AuthStack or AppStack.
       */
      navigationRef.navigate(
        'MainStack',
      );
    }, []);

  const handleDeepLink =
    useCallback(
      (
        url: string,
      ) => {
        const cleaned =
          url
            .trim()
            .replace(
              /^nestboard:\/\//i,
              '',
            )
            .replace(
              /^\/+/,
              '',
            );

        const path =
          cleaned
            .split('?')[0]
            .split('#')[0];

        const propertyMatch =
          path.match(
            /^property\/([^/]+)\/?$/i,
          );

        if (
          propertyMatch?.[1]
        ) {
          const propertyId =
            decodeURIComponent(
              propertyMatch[1],
            );

          openProperty(
            propertyId,
          );

          return;
        }

        if (
          /^my-bookings\/?$/i.test(
            path,
          )
        ) {
          if (
            isAuthenticated
          ) {
            openMyBookings();
          } else {
            pendingDestination.current =
              {
                type:
                  'MY_BOOKINGS',
              };

            openLogin();
          }

          return;
        }

        pendingDestination.current =
          null;
      },
      [
        isAuthenticated,
        openLogin,
        openMyBookings,
        openProperty,
      ],
    );

  useEffect(() => {
    if (
      !navigationReady ||
      authLoading ||
      !apiReady
    ) {
      return;
    }

    Linking.getInitialURL()
      .then(url => {
        if (url) {
          handleDeepLink(url);
        }
      })
      .catch(() => {});

    const subscription =
      Linking.addEventListener(
        'url',
        event => {
          handleDeepLink(
            event.url,
          );
        },
      );

    return () =>
      subscription.remove();
  }, [
    apiReady,
    authLoading,
    handleDeepLink,
    navigationReady,
  ]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !pendingDestination.current
    ) {
      return;
    }

    const destination =
      pendingDestination.current;

    pendingDestination.current =
      null;

    const timer =
      setTimeout(() => {
        if (
          destination.type ===
          'PROPERTY'
        ) {
          openProperty(
            destination.propertyId,
          );
        }

        if (
          destination.type ===
          'MY_BOOKINGS'
        ) {
          openMyBookings();
        }
      }, 150);

    return () =>
      clearTimeout(timer);
  }, [
    isAuthenticated,
    openMyBookings,
    openProperty,
  ]);

  if (
    authLoading ||
    !apiReady
  ) {
    return (
      <SplashScreen
        onReady={() =>
          setApiReady(true)
        }
      />
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        setNavigationReady(true)
      }
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="MainStack"
          component={MainStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;