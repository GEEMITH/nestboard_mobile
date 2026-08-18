import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Bell,
  CheckCheck,
  ChevronRight,
} from 'lucide-react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import Typography
  from '../../../components/ui/Typography';

import {
  Colors,
} from '../../../constant/colors';

import {
  NotificationsAPI,
} from '../../../api/notifications';

import type {
  AppNotification,
} from '../../../types/notifications';

const Notifications = () => {
  const navigation: any =
    useNavigation();

  const [
    notifications,
    setNotifications,
  ] = useState<
    AppNotification[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    markingAll,
    setMarkingAll,
  ] = useState(false);

  const loadNotifications =
    useCallback(
      async () => {
        try {
          const data =
            await NotificationsAPI.getAll();

          setNotifications(data);
        } catch (error) {
          console.error(
            'Failed to load notifications:',
            error,
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
    );

  useEffect(() => {
    loadNotifications();
  }, [
    loadNotifications,
  ]);

  const handleRefresh = () => {
    setRefreshing(true);

    loadNotifications();
  };

  const handleMarkAllRead =
    async () => {
      try {
        setMarkingAll(true);

        await NotificationsAPI.markAllAsRead();

        setNotifications(
          current =>
            current.map(
              notification => ({
                ...notification,
                isRead: true,
              }),
            ),
        );
      } catch (error) {
        Alert.alert(
          'Error',
          'Unable to mark notifications as read.',
        );
      } finally {
        setMarkingAll(false);
      }
    };

  const handleNotificationPress =
    async (
      notification: AppNotification,
    ) => {
      try {
        if (!notification.isRead) {
          await NotificationsAPI.markAsRead(
            notification.id,
          );

          setNotifications(
            current =>
              current.map(
                item =>
                  item.id ===
                  notification.id
                    ? {
                        ...item,
                        isRead: true,
                      }
                    : item,
              ),
          );
        }

        if (
          notification.propertyId
        ) {
          navigation.navigate(
            'PropertyDetails',
            {
              propertyId:
                notification.propertyId,
            },
          );

          return;
        }

        if (
          notification.bookingId
        ) {
          navigation.navigate(
            'MyBookings',
          );
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Unable to open notification.',
        );
      }
    };

  const renderItem = ({
    item,
  }: {
    item: AppNotification;
  }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        handleNotificationPress(
          item,
        )
      }
      style={[
        styles.notificationCard,
        !item.isRead &&
          styles.unreadCard,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          !item.isRead &&
            styles.unreadIcon,
        ]}
      >
        <Bell
          size={22}
          color={
            item.isRead
              ? '#6B7280'
              : Colors.PRIMARY_COLOR
          }
        />
      </View>

      <View style={styles.textArea}>
        <Typography
          variant="h3"
          style={styles.message}
        >
          {item.message}
        </Typography>

        {item.property?.title ? (
          <Typography
            variant="caption"
            style={
              styles.propertyName
            }
          >
            {item.property.title}
          </Typography>
        ) : null}

        <Typography
          variant="caption"
          style={styles.date}
        >
          {new Date(
            item.createdAt,
          ).toLocaleString()}
        </Typography>
      </View>

      <View style={styles.rightArea}>
        {!item.isRead ? (
          <View
            style={styles.unreadDot}
          />
        ) : null}

        <ChevronRight
          size={20}
          color="#9CA3AF"
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={
            Colors.PRIMARY_COLOR
          }
        />
      </View>
    );
  }

  const unreadCount =
    notifications.filter(
      item => !item.isRead,
    ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Typography variant="h1">
            Notifications
          </Typography>

          <Typography
            variant="caption"
            style={styles.subtitle}
          >
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You are all caught up'}
          </Typography>
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity
            style={
              styles.markAllButton
            }
            onPress={
              handleMarkAllRead
            }
            disabled={
              markingAll
            }
          >
            {markingAll ? (
              <ActivityIndicator
                size="small"
                color={
                  Colors.PRIMARY_COLOR
                }
              />
            ) : (
              <>
                <CheckCheck
                  size={18}
                  color={
                    Colors.PRIMARY_COLOR
                  }
                />

                <Typography
                  variant="caption"
                  style={
                    styles.markAllText
                  }
                >
                  Read all
                </Typography>
              </>
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={
          item => item.id
        }
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          notifications.length === 0 &&
            styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            colors={[
              Colors.PRIMARY_COLOR,
            ]}
          />
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Bell
              size={52}
              color="#9CA3AF"
            />

            <Typography
              variant="h2"
              style={styles.emptyTitle}
            >
              No notifications
            </Typography>

            <Typography
              variant="caption"
              style={styles.emptyText}
            >
              Booking updates and important
              property updates will appear here.
            </Typography>
          </View>
        }
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.WHITE,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  subtitle: {
    color: '#6B7280',
    marginTop: 4,
  },

  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFF3ED',
  },

  markAllText: {
    color:
      Colors.PRIMARY_COLOR,
    fontWeight: '700',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },

  unreadCard: {
    backgroundColor: '#FFF7F3',
    borderWidth: 1,
    borderColor: '#FFE1D4',
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },

  unreadIcon: {
    backgroundColor: '#FFF0E9',
  },

  textArea: {
    flex: 1,
    gap: 4,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
  },

  propertyName: {
    color:
      Colors.PRIMARY_COLOR,
  },

  date: {
    color: '#9CA3AF',
  },

  rightArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor:
      Colors.PRIMARY_COLOR,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyTitle: {
    marginTop: 16,
  },

  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
});