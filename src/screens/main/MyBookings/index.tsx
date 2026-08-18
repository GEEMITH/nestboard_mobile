import React from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  RefreshCcw,
} from 'lucide-react-native';

import Typography
  from '../../../components/ui/Typography';

import {
  Colors,
} from '../../../constant/colors';

import {
  useBookings,
} from '../../../hooks/useBookings';

import {
  Booking,
} from '../../../types/bookings';

import {
  formatNumberIntoCurrency,
} from '../../../util/common';

const statusColor = (
  status: Booking['status'],
) => {
  switch (status) {
    case 'CONFIRMED':
      return '#10B981';

    case 'PENDING':
      return '#F59E0B';

    case 'CANCELLED':
      return '#EF4444';

    case 'EXPIRED':
      return '#6B7280';

    default:
      return Colors.TEXT_GRAY;
  }
};

const BookingCard = ({
  booking,
}: {
  booking: Booking;
}) => {
  const property =
    booking.room.roomType.property;

  const room =
    booking.room;

  return (
    <View style={styles.card}>
      {property.imageUrl ? (
        <Image
          source={{
            uri: property.imageUrl,
          }}
          style={styles.image}
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.imagePlaceholder,
          ]}
        />
      )}

      <View style={styles.content}>
        <View
          style={
            styles.titleRow
          }
        >
          <Typography variant="h2">
            {property.title}
          </Typography>

          <View
            style={[
              styles.status,
              {
                backgroundColor:
                  `${statusColor(
                    booking.status,
                  )}20`,
              },
            ]}
          >
            <Typography
              variant="caption"
              color={statusColor(
                booking.status,
              )}
            >
              {booking.status}
            </Typography>
          </View>
        </View>

        <Typography
          color={Colors.TEXT_GRAY}
          style={{
            marginTop: 6,
          }}
        >
          {property.city ?? ''}
        </Typography>

        <View
          style={styles.divider}
        />

        <View
          style={styles.row}
        >
          <Typography
            color={Colors.TEXT_GRAY}
          >
            Room
          </Typography>

          <Typography variant="h3">
            {room.name}
          </Typography>
        </View>

        <View
          style={styles.row}
        >
          <Typography
            color={Colors.TEXT_GRAY}
          >
            Seat
          </Typography>

          <Typography variant="h3">
            {booking.seatIndex}
          </Typography>
        </View>

        <View
          style={styles.row}
        >
          <Typography
            color={Colors.TEXT_GRAY}
          >
            Duration
          </Typography>

          <Typography variant="h3">
            {booking.duration} months
          </Typography>
        </View>

        <View
          style={styles.row}
        >
          <Typography
            color={Colors.TEXT_GRAY}
          >
            Total
          </Typography>

          <Typography variant="h3">
            {formatNumberIntoCurrency(
              Number(
                booking.totalAmount,
              ),
            )}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const MyBookings = () => {
  const {
    bookings,
    loading,
    error,
    refetch,
  } = useBookings();

  if (
    loading &&
    bookings.length === 0
  ) {
    return (
      <View
        style={styles.center}
      >
        <ActivityIndicator
          size="large"
          color={
            Colors.PRIMARY_COLOR
          }
        />
      </View>
    );
  }

  if (
    error &&
    bookings.length === 0
  ) {
    return (
      <View
        style={styles.center}
      >
        <RefreshCcw
          size={64}
          color={Colors.ICON_GRAY}
        />

        <Typography
          style={{
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          {error}
        </Typography>

        <TouchableOpacity
          onPress={refetch}
          style={
            styles.retryButton
          }
        >
          <Typography
            variant="button"
            color={Colors.WHITE}
          >
            Retry
          </Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <Typography variant="h1">
          My Bookings
        </Typography>

        {loading && (
          <ActivityIndicator
            color={
              Colors.PRIMARY_COLOR
            }
          />
        )}
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
          />
        )}
        refreshing={loading}
        onRefresh={refetch}
        contentContainerStyle={[
          styles.list,
          bookings.length === 0 &&
            styles.emptyList,
        ]}
        ListEmptyComponent={
          <View
            style={styles.center}
          >
            <Typography variant="h2">
              No bookings yet
            </Typography>

            <Typography
              color={
                Colors.TEXT_GRAY
              }
              style={{
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Your confirmed and pending
              bookings will appear here.
            </Typography>
          </View>
        }
      />
    </View>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.WHITE,
    paddingHorizontal: 16,
  },

  header: {
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  list: {
    paddingBottom: 140,
    gap: 16,
  },

  emptyList: {
    flexGrow: 1,
  },

  card: {
    backgroundColor:
      Colors.WHITE,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 170,
  },

  imagePlaceholder: {
    backgroundColor:
      '#E5E7EB',
  },

  content: {
    padding: 16,
    gap: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
    gap: 8,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },

  divider: {
    height: 1,
    backgroundColor:
      Colors.BORDER_GRAY,
    marginVertical: 8,
  },

  row: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  center: {
    flex: 1,
    justifyContent:
      'center',
    alignItems: 'center',
    padding: 32,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor:
      Colors.PRIMARY_COLOR,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 100,
  },
});