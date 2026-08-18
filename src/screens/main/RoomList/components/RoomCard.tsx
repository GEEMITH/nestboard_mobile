import React, {
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Plus,
  User,
} from 'lucide-react-native';

import {
  useDispatch,
} from 'react-redux';

import Typography
  from '../../../../components/ui/Typography';

import RegularButton
  from '../../../../components/ui/RegularButton';

import {
  Colors,
} from '../../../../constant/colors';

import {
  updateBookingDetails,
} from '../../../../store/bookingSlice';

import type {
  Room,
  Seat,
} from '../../../../types/properties';

type Props = {
  room: Room;

  price: string;
};

const RoomCard = ({
  room,
  price,
}: Props) => {
  const navigation: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const [
    selectedSeat,
    setSelectedSeat,
  ] = useState<
    number | null
  >(null);

  /*
   * Always work with an array.
   */
  const seats: Seat[] =
    Array.isArray(room.booking)
      ? room.booking
      : [];

  const availableSeats =
    useMemo(
      () =>
        seats.filter(
          seat =>
            !seat.tenant ||
            seat.tenant.trim() === '',
        ),
      [seats],
    );

  const handleSeatPress = (
    seatIndex: number,
  ) => {
    setSelectedSeat(
      current =>
        current === seatIndex
          ? null
          : seatIndex,
    );
  };

  const bookThisSeat = () => {
    if (
      selectedSeat === null
    ) {
      Alert.alert(
        'Select a seat',
        'Please select an available seat first.',
      );

      return;
    }

    /*
     * Store exactly what ConfirmBooking
     * needs.
     */
    dispatch(
      updateBookingDetails({
        roomId:
          room.roomId,

        roomName:
          room.roomName,

        seatIndex:
          selectedSeat,

        pricePerSeat:
          String(price),

        date: '',

        duration: 0,
      }),
    );

    navigation.navigate(
      'ConfirmBooking',
    );
  };

  const getInitials = (
    tenant: string,
  ) => {
    if (!tenant?.trim()) {
      return '';
    }

    const parts =
      tenant.trim().split(/\s+/);

    return parts
      .slice(0, 2)
      .map(
        part =>
          part.charAt(0),
      )
      .join('')
      .toUpperCase();
  };

  return (
    <View
      style={styles.card}
    >
      {/* ROOM NAME */}
      <View
        style={styles.header}
      >
        <View
          style={styles.headerText}
        >
          <Typography
            variant="h2"
          >
            {room.roomName}
          </Typography>

          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
            style={
              styles.price
            }
          >
            LKR {price} / seat /
            month
          </Typography>
        </View>

        <View
          style={styles.availableBadge}
        >
          <Typography
            variant="caption"
            color="#10B981"
          >
            {availableSeats.length}{' '}
            Available
          </Typography>
        </View>
      </View>

      {/* SEAT SECTION */}
      <View
        style={styles.seatSection}
      >
        <Typography
          variant="h3"
          style={
            styles.seatTitle
          }
        >
          Select a Seat
        </Typography>

        <Typography
          variant="caption"
          color={
            Colors.TEXT_GRAY
          }
          style={
            styles.seatHint
          }
        >
          Tap an available seat
          to select it.
        </Typography>

        {seats.length === 0 ? (
          <View
            style={
              styles.noSeats
            }
          >
            <Typography
              variant="body"
              color={
                Colors.TEXT_GRAY
              }
            >
              No seat information
              is available for this
              room.
            </Typography>
          </View>
        ) : (
          <View
            style={
              styles.seatGrid
            }
          >
            {seats.map(
              seat => {
                const isAvailable =
                  !seat.tenant ||
                  seat.tenant.trim() ===
                    '';

                const isSelected =
                  selectedSeat ===
                  seat.seatIndex;

                if (!isAvailable) {
                  return (
                    <View
                      key={
                        seat.seatIndex
                      }
                      style={[
                        styles.seat,
                        styles.occupiedSeat,
                      ]}
                    >
                      <User
                        size={18}
                        color="#FFFFFF"
                      />

                      <Typography
                        variant="caption"
                        color="#FFFFFF"
                        style={
                          styles.seatNumber
                        }
                      >
                        {getInitials(
                          seat.tenant,
                        )}
                      </Typography>
                    </View>
                  );
                }

                return (
                  <TouchableOpacity
                    key={
                      seat.seatIndex
                    }
                    activeOpacity={0.7}
                    onPress={() =>
                      handleSeatPress(
                        seat.seatIndex,
                      )
                    }
                    style={[
                      styles.seat,
                      styles.availableSeat,
                      isSelected &&
                        styles.selectedSeat,
                    ]}
                  >
                    {isSelected ? (
                      <Typography
                        variant="h3"
                        color={
                          Colors.PRIMARY_COLOR
                        }
                      >
                        ✓
                      </Typography>
                    ) : (
                      <Plus
                        size={22}
                        color={
                          Colors.PRIMARY_COLOR
                        }
                      />
                    )}

                    <Typography
                      variant="caption"
                      color={
                        Colors.PRIMARY_COLOR
                      }
                      style={
                        styles.seatNumber
                      }
                    >
                      {seat.seatIndex}
                    </Typography>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        )}

        {/* LEGEND */}
        <View
          style={styles.legend}
        >
          <View
            style={styles.legendItem}
          >
            <View
              style={[
                styles.legendDot,
                styles.legendAvailable,
              ]}
            />

            <Typography
              variant="caption"
            >
              Available
            </Typography>
          </View>

          <View
            style={styles.legendItem}
          >
            <View
              style={[
                styles.legendDot,
                styles.legendOccupied,
              ]}
            />

            <Typography
              variant="caption"
            >
              Occupied
            </Typography>
          </View>
        </View>
      </View>

      {/* BOOK BUTTON */}
      <RegularButton
        disable={
          selectedSeat === null
        }
        text={
          selectedSeat === null
            ? 'Select a Seat'
            : `Book Seat ${selectedSeat}`
        }
        onPress={
          bookThisSeat
        }
        Icon={null}
      />
    </View>
  );
};

export default RoomCard;

const styles =
  StyleSheet.create({
    card: {
      borderRadius: 18,
      backgroundColor:
        Colors.WHITE,
      padding: 20,

      elevation: 2,

      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    header: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'flex-start',
    },

    headerText: {
      flex: 1,
    },

    price: {
      marginTop: 6,
    },

    availableBadge: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor:
        '#D1FAE5',
    },

    seatSection: {
      marginTop: 24,
    },

    seatTitle: {
      marginBottom: 4,
    },

    seatHint: {
      marginBottom: 18,
    },

    seatGrid: {
      flexDirection:
        'row',
      flexWrap: 'wrap',
      gap: 14,
    },

    seat: {
      width: 58,
      height: 58,
      borderRadius: 29,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    availableSeat: {
      borderWidth: 2,
      borderColor:
        Colors.PRIMARY_COLOR,
      backgroundColor:
        '#FFF5F0',
    },

    selectedSeat: {
      backgroundColor:
        '#FFE1D5',
      borderWidth: 3,
      borderColor:
        Colors.PRIMARY_COLOR,
    },

    occupiedSeat: {
      backgroundColor:
        '#704F3C',
    },

    seatNumber: {
      marginTop: 2,
      fontWeight: '700',
    },

    noSeats: {
      padding: 20,
      borderRadius: 12,
      backgroundColor:
        '#F8FAFC',
      alignItems:
        'center',
    },

    legend: {
      flexDirection:
        'row',
      gap: 24,
      marginTop: 20,
    },

    legendItem: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 7,
    },

    legendDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
    },

    legendAvailable: {
      backgroundColor:
        Colors.PRIMARY_COLOR,
    },

    legendOccupied: {
      backgroundColor:
        '#704F3C',
    },
  });