import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Bell,
  Heart,
  Home,
  User,
} from 'lucide-react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import HomeScreen
  from '../../screens/main/Home';

import Favourites
  from '../../screens/main/Favorite';

import Profile
  from '../../screens/main/Profile';

import {
  Colors,
} from '../../constant/colors';

import {
  NotificationsAPI,
} from '../../api/notifications';

const Tab =
  createBottomTabNavigator();

/*
 * These are used by BottomTabView.tsx.
 *
 * Keep this export because BottomTabView
 * imports:
 *
 * import { Tabs } from "./TabScreens";
 */
export const Tabs = [
  {
    defaultIcon: (
      <Home
        size={24}
        color={Colors.ICON_GRAY}
      />
    ),

    selectedIcon: (
      <Home
        size={24}
        color={Colors.WHITE}
        fill={Colors.WHITE}
      />
    ),
  },

  {
    defaultIcon: (
      <Heart
        size={24}
        color={Colors.ICON_GRAY}
      />
    ),

    selectedIcon: (
      <Heart
        size={24}
        color={Colors.WHITE}
        fill={Colors.WHITE}
      />
    ),
  },

  {
    defaultIcon: (
      <User
        size={24}
        color={Colors.ICON_GRAY}
      />
    ),

    selectedIcon: (
      <User
        size={24}
        color={Colors.WHITE}
        fill={Colors.WHITE}
      />
    ),
  },
];

const ProfileTabIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => {
  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const loadUnreadCount =
    useCallback(
      async () => {
        try {
          const notifications =
            await NotificationsAPI.getAll();

          const count =
            notifications.filter(
              item =>
                !item.isRead,
            ).length;

          setUnreadCount(count);
        } catch (error) {
          console.error(
            'Unable to load notification count:',
            error,
          );

          /*
           * Don't break the tab bar if
           * notifications cannot be loaded.
           */
          setUnreadCount(0);
        }
      },
      [],
    );

  /*
   * Refresh immediately whenever
   * the Profile tab comes into focus.
   */
  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();

      return undefined;
    }, [
      loadUnreadCount,
    ]),
  );

  /*
   * Also refresh periodically while
   * the component is mounted.
   */
  useEffect(() => {
    const interval =
      setInterval(
        loadUnreadCount,
        30000,
      );

    return () =>
      clearInterval(interval);
  }, [
    loadUnreadCount,
  ]);

  return (
    <View>
      <User
        color={color}
        size={size}
      />

      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <Bell
            size={9}
            color="#FFFFFF"
          />
        </View>
      ) : null}
    </View>
  );
};

const TabScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          Colors.PRIMARY_COLOR,

        tabBarInactiveTintColor:
          Colors.ICON_GRAY,

        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Home
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Heart
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <ProfileTabIcon
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreens;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      Colors.PRIMARY_COLOR,
    borderWidth: 2,
    borderColor:
      Colors.WHITE,
  },
});