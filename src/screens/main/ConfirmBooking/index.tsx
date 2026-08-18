import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';

import {
  Picker,
} from '@react-native-picker/picker';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import dayjs from 'dayjs';

import {
  Lock,
} from 'lucide-react-native';

import ConfirmScreenHeader
  from './components/Header';

import Typography
  from '../../../components/ui/Typography';

import RegularButton
  from '../../../components/ui/RegularButton';

import {
  RootState,
} from '../../../store/store';

import {
  Colors,
} from '../../../constant/colors';

import {
  BookingAPI,
} from '../../../api/bookings';

import {
  formatNumberIntoCurrency,
} from '../../../util/common';

import {
  clearBooking,
} from '../../../store/bookingSlice';

const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const currentYear =
  new Date().getFullYear();

const currentMonthIndex =
  new Date().getMonth();

const Years = [
  currentYear,
  currentYear + 1,
  currentYear + 2,
];

/*
 * NestBoard booking confirmation window.
 *
 * The UI uses one minute as requested.
 *
 * If the backend returns expiresAt,
 * that value is preferred.
 */
const CLIENT_CONFIRMATION_SECONDS = 60;

const ConfirmBooking = () => {
  const navigation: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const currentProperty =
    useSelector(
      (
        state: RootState,
      ) =>
        state.property
          .currentProperty,
    );

  const bookingData =
    useSelector(
      (
        state: RootState,
      ) =>
        state.booking.data,
    );

  /*
   * Selected room.
   */
  const roomId =
    bookingData?.roomId;

  const roomName =
    bookingData?.roomName;

  const seatIndex =
    bookingData?.seatIndex;

  /*
   * Convert price safely.
   */
  const pricePerSeat =
    useMemo(() => {
      const raw =
        bookingData?.pricePerSeat;

      if (
        raw === undefined ||
        raw === null
      ) {
        return 0;
      }

      const cleaned =
        String(raw)
          .replace(/LKR/gi, '')
          .replace(/,/g, '')
          .replace(/[^0-9.]/g, '');

      const value =
        Number(cleaned);

      return Number.isFinite(
        value,
      )
        ? value
        : 0;
    }, [
      bookingData?.pricePerSeat,
    ]);

  /*
   * IMPORTANT FIX:
   *
   * Start from the CURRENT month,
   * not January.
   *
   * Before:
   *   2026-Jan
   *
   * Now:
   *   2026-Aug
   */
  const initialStart =
    `${currentYear}-${Months[currentMonthIndex]}`;

  /*
   * Default lease is 3 months.
   *
   * Example:
   * August 2026 -> November 2026
   */
  const initialEndDate =
    dayjs(
      `${currentYear}-${String(
        currentMonthIndex + 1,
      ).padStart(2, '0')}-01`,
    )
      .add(3, 'month')
      .format('YYYY-MM');

  const initialEnd =
    `${Number(
      initialEndDate.split('-')[0],
    )}-${Months[
      Number(
        initialEndDate.split('-')[1],
      ) - 1
    ]}`;

  const [
    fromDate,
    setFromDate,
  ] = useState(
    initialStart,
  );

  const [
    toDate,
    setToDate,
  ] = useState(
    initialEnd,
  );

  const [
    booking,
    setBooking,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  /*
   * PENDING BOOKING STATE
   */
  const [
    pendingBookingId,
    setPendingBookingId,
  ] = useState<
    string | null
  >(null);

  const [
    pendingCreatedAt,
    setPendingCreatedAt,
  ] = useState<
    number | null
  >(null);

  const [
    secondsRemaining,
    setSecondsRemaining,
  ] = useState(
    CLIENT_CONFIRMATION_SECONDS,
  );

  const [
    confirming,
    setConfirming,
  ] = useState(false);

  /*
   * Calculate duration.
   */
  const duration =
    useMemo(() => {
      const start =
        dayjs(
          fromDate,
          'YYYY-MMM',
        );

      const end =
        dayjs(
          toDate,
          'YYYY-MMM',
        );

      if (
        !start.isValid() ||
        !end.isValid()
      ) {
        return 0;
      }

      return Math.max(
        end.diff(
          start,
          'month',
        ),
        0,
      );
    }, [
      fromDate,
      toDate,
    ]);

  /*
   * Total preview.
   */
  const total =
    useMemo(() => {
      return (
        pricePerSeat *
        duration
      );
    }, [
      pricePerSeat,
      duration,
    ]);

  /*
   * Keep end date valid when
   * start date changes.
   */
  const handleStartDateChange =
    (value: string) => {
      const start =
        dayjs(
          value,
          'YYYY-MMM',
        );

      if (
        !start.isValid()
      ) {
        return;
      }

      /*
       * Never allow a past month.
       */
      const now =
        dayjs().startOf('month');

      if (
        start.isBefore(
          now,
          'month',
        )
      ) {
        Alert.alert(
          'Invalid lease month',
          'You cannot start a lease in a past month.',
        );

        return;
      }

      setFromDate(value);

      const currentEnd =
        dayjs(
          toDate,
          'YYYY-MMM',
        );

      /*
       * If current end is before
       * new start, automatically
       * move it 3 months forward.
       */
      if (
        !currentEnd.isValid() ||
        currentEnd.isBefore(
          start,
          'month',
        ) ||
        currentEnd.isSame(
          start,
          'month',
        )
      ) {
        const newEnd =
          start.add(
            3,
            'month',
          );

        setToDate(
          newEnd.format(
            'YYYY-MMM',
          ),
        );
      }
    };

  /*
   * End date validation.
   */
  const handleEndDateChange =
    (value: string) => {
      const start =
        dayjs(
          fromDate,
          'YYYY-MMM',
        );

      const end =
        dayjs(
          value,
          'YYYY-MMM',
        );

      if (
        !start.isValid() ||
        !end.isValid()
      ) {
        return;
      }

      if (
        end.isBefore(
          start,
          'month',
        )
      ) {
        Alert.alert(
          'Invalid lease period',
          'The end month cannot be before the start month.',
        );

        return;
      }

      if (
        end.isSame(
          start,
          'month',
        )
      ) {
        Alert.alert(
          'Invalid lease period',
          'Please select at least 1 month.',
        );

        return;
      }

      setToDate(value);
    };

  /*
   * ----------------------------------------------------------
   * CREATE PENDING BOOKING
   * ----------------------------------------------------------
   */
  const bookNow =
  async () => {
    if (!roomId) {
      Alert.alert(
        'Missing room',
        'The selected room could not be found. Please select the room again.',
      );

      return;
    }

    if (
      seatIndex ===
        undefined ||
      seatIndex === null
    ) {
      Alert.alert(
        'Select a seat',
        'Please go back and select an available seat.',
      );

      return;
    }

    if (
      pricePerSeat <= 0
    ) {
      Alert.alert(
        'Invalid room price',
        'The room price could not be loaded. Please go back and select the room again.',
      );

      return;
    }

    if (
      duration <= 0
    ) {
      Alert.alert(
        'Invalid lease',
        'Please select a valid lease period.',
      );

      return;
    }

    /*
     * Do not allow a past lease.
     */
    const start =
      dayjs(
        fromDate,
        'YYYY-MMM',
      );

    const currentMonth =
      dayjs().startOf('month');

    if (
      start.isBefore(
        currentMonth,
        'month',
      )
    ) {
      Alert.alert(
        'Invalid lease month',
        'The lease start month cannot be in the past.',
      );

      return;
    }

    setBooking(true);
    setError(null);

    try {
      /*
       * Backend expects:
       *
       * roomId
       * seatNumber
       * startMonth
       * durationMonths
       */
      const response =
        await BookingAPI.createBooking(
          roomId,
          seatIndex,
          start.format(
            'YYYY-MM',
          ),
          duration,
        );

      console.log(
        'BOOKING CREATE RESPONSE:',
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      /*
       * IMPORTANT:
       *
       * Different API clients may return:
       *
       * response
       * response.data
       * response.booking
       * response.data.booking
       *
       * Resolve all common shapes.
       */
      const bookingRecord =
        (response as any)?.booking ??
        (response as any)?.data?.booking ??
        (response as any)?.data ??
        response;

      console.log(
        'BOOKING RECORD:',
        JSON.stringify(
          bookingRecord,
          null,
          2,
        ),
      );

      /*
       * Get the booking ID from
       * whichever response shape
       * the API returned.
       */
      const bookingId =
        bookingRecord?.id ??
        bookingRecord?.bookingId ??
        bookingRecord?.booking?.id ??
        (response as any)?.id ??
        (response as any)?.data?.id;

      /*
       * If there is no booking ID,
       * THEN the server response is
       * genuinely unusable.
       */
      if (!bookingId) {
        console.error(
          'BOOKING RESPONSE HAS NO ID:',
          response,
        );

        throw new Error(
          'The booking was created but the server did not return a booking ID.',
        );
      }

      /*
       * If the API returned a status,
       * make sure it is pending.
       *
       * We DO NOT require status to
       * exist because some API wrappers
       * may return only the booking ID.
       */
      const bookingStatus =
        bookingRecord?.status ??
        (response as any)?.status ??
        (response as any)?.data?.status;

      console.log(
        'BOOKING ID:',
        bookingId,
      );

      console.log(
        'BOOKING STATUS:',
        bookingStatus,
      );

      /*
       * If the backend explicitly says
       * something other than PENDING,
       * stop.
       */
      if (
        bookingStatus &&
        bookingStatus !==
          'PENDING'
      ) {
        throw new Error(
          `Booking returned unexpected status: ${bookingStatus}`,
        );
      }

      /*
       * IMPORTANT:
       *
       * We DO NOT call confirmBooking()
       * here.
       *
       * The booking must remain PENDING
       * until the user confirms it.
       */

      const createdAt =
        Date.now();

      setPendingBookingId(
        String(
          bookingId,
        ),
      );

      setPendingCreatedAt(
        createdAt,
      );

      /*
       * Prefer backend expiry time
       * if the API provides it.
       */
      const expiresAt =
        bookingRecord?.expiresAt ??
        bookingRecord?.paymentExpiresAt ??
        bookingRecord?.expires_at ??
        (response as any)
          ?.expiresAt ??
        (response as any)
          ?.data?.expiresAt;

      if (expiresAt) {
        const remaining =
          Math.max(
            0,
            Math.ceil(
              (
                new Date(
                  expiresAt,
                ).getTime() -
                Date.now()
              ) / 1000,
            ),
          );

        setSecondsRemaining(
          remaining > 0
            ? remaining
            : CLIENT_CONFIRMATION_SECONDS,
        );
      } else {
        /*
         * Your requested one-minute
         * client confirmation window.
         */
        setSecondsRemaining(
          CLIENT_CONFIRMATION_SECONDS,
        );
      }

      /*
       * SUCCESS
       */
      Alert.alert(
        'Booking pending',
        `Seat ${seatIndex} in ${
          roomName ??
          'the selected room'
        } is now held for you. Confirm it before the timer expires.`,
      );
    } catch (
      err: any
    ) {
      console.error(
        'BOOKING CREATE ERROR:',
        err?.response?.data ??
          err,
      );

      const status =
        err?.response?.status;

      const code =
        err?.response?.data
          ?.error?.code ??
        err?.response?.data
          ?.code;

      const message =
        err?.response?.data
          ?.error?.message ??
        err?.response?.data
          ?.message ??
        err?.message ??
        'Unable to complete your booking.';

      /*
       * Seat conflict.
       */
      if (
        status === 409 ||
        code === 'CONFLICT'
      ) {
        setError(
          'This seat is no longer available for the selected lease period.',
        );

        Alert.alert(
          'Seat unavailable',
          'This seat was just taken or is already reserved for this lease period. Please go back and choose another available seat.',
        );

        return;
      }

      /*
       * Authentication error.
       */
      if (
        status === 401
      ) {
        setError(
          'Your session has expired. Please sign in again.',
        );

        Alert.alert(
          'Session expired',
          'Please sign in again and retry the booking.',
        );

        return;
      }

      /*
       * Validation error.
       */
      if (
        status === 400
      ) {
        setError(
          message,
        );

        Alert.alert(
          'Invalid booking',
          message,
        );

        return;
      }

      /*
       * Generic server error.
       */
      setError(
        message,
      );

      Alert.alert(
        'Booking failed',
        message,
      );
    } finally {
      setBooking(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * CONFIRM PENDING BOOKING
   * ----------------------------------------------------------
   */
  const confirmPendingBooking =
    async () => {
      if (
        !pendingBookingId ||
        confirming
      ) {
        return;
      }

      if (
        secondsRemaining <= 0
      ) {
        Alert.alert(
          'Booking expired',
          'The confirmation window has expired. Please start the booking again.',
        );

        setPendingBookingId(
          null,
        );

        setPendingCreatedAt(
          null,
        );

        setError(
          'The booking confirmation window expired.',
        );

        dispatch(
          clearBooking(),
        );

        return;
      }

      setConfirming(true);
      setError(null);

      try {
        const confirmed =
          await BookingAPI.confirmBooking(
            pendingBookingId,
          );

        if (
          confirmed?.status !==
          'CONFIRMED'
        ) {
          throw new Error(
            'The booking could not be confirmed.',
          );
        }

        /*
         * Booking successfully confirmed.
         */
        const bookedSeat =
          seatIndex;

        const bookedRoom =
          roomName ??
          'the selected room';

        setPendingBookingId(
          null,
        );

        setPendingCreatedAt(
          null,
        );

        setSecondsRemaining(
          0,
        );

        dispatch(
          clearBooking(),
        );

        Alert.alert(
          'Booking confirmed',
          `Seat ${bookedSeat} in ${bookedRoom} has been successfully reserved.`,
          [
            {
              text:
                'View My Bookings',
              onPress: () =>
                navigation.navigate(
                  'MyBookings',
                ),
            },
          ],
        );
      } catch (
        err: any
      ) {
        console.error(
          'BOOKING CONFIRM ERROR:',
          err?.response?.data ??
            err,
        );

        const status =
          err?.response?.status;

        const code =
          err?.response?.data
            ?.error?.code ??
          err?.response?.data
            ?.code;

        const message =
          err?.response?.data
            ?.error?.message ??
          err?.response?.data
            ?.message ??
          err?.message ??
          'Unable to confirm the booking.';

        if (
          status === 409 ||
          code === 'CONFLICT'
        ) {
          setError(
            message ||
              'The booking confirmation window has expired or the booking is no longer available.',
          );

          Alert.alert(
            'Booking could not be confirmed',
            message ||
              'The booking confirmation window has expired or the booking is no longer available.',
          );

          setPendingBookingId(
            null,
          );

          setPendingCreatedAt(
            null,
          );

          dispatch(
            clearBooking(),
          );
        } else {
          setError(
            message,
          );

          Alert.alert(
            'Confirmation failed',
            message,
          );
        }
      } finally {
        setConfirming(false);
      }
    };

  /*
   * ----------------------------------------------------------
   * ONE-MINUTE COUNTDOWN
   * ----------------------------------------------------------
   */
  useEffect(() => {
    if (
      !pendingBookingId ||
      !pendingCreatedAt
    ) {
      return;
    }

    const timer =
      setInterval(
        () => {
          const elapsed =
            Math.floor(
              (
                Date.now() -
                pendingCreatedAt
              ) / 1000,
            );

          const remaining =
            Math.max(
              0,
              CLIENT_CONFIRMATION_SECONDS -
                elapsed,
            );

          setSecondsRemaining(
            remaining,
          );

          if (
            remaining <= 0
          ) {
            clearInterval(
              timer,
            );

            setPendingBookingId(
              null,
            );

            setPendingCreatedAt(
              null,
            );

            setError(
              'The booking confirmation window expired.',
            );

            dispatch(
              clearBooking(),
            );

            Alert.alert(
              'Booking expired',
              'The one-minute confirmation window has expired. The seat can now be booked again according to server availability.',
            );
          }
        },
        1000,
      );

    return () =>
      clearInterval(
        timer,
      );
  }, [
    pendingBookingId,
    pendingCreatedAt,
    dispatch,
  ]);

  /*
   * ----------------------------------------------------------
   * PENDING BOOKING SCREEN
   * ----------------------------------------------------------
   */
  if (
    pendingBookingId
  ) {
    const minutes =
      Math.floor(
        secondsRemaining /
          60,
      );

    const seconds =
      secondsRemaining %
      60;

    const timerText =
      `${String(
        minutes,
      ).padStart(2, '0')}:${String(
        seconds,
      ).padStart(2, '0')}`;

    return (
      <View
        style={
          styles.container
        }
      >
        <ConfirmScreenHeader />

        <View
          style={
            styles.pendingCard
          }
        >
          <View
            style={
              styles.pendingIcon
            }
          >
            <Lock
              size={30}
              color={
                Colors.WHITE
              }
            />
          </View>

          <Typography
            variant="h1"
            style={
              styles.pendingTitle
            }
          >
            Booking Pending
          </Typography>

          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
            style={
              styles.pendingSubtitle
            }
          >
            Your seat is currently
            held for you.
          </Typography>

          <View
            style={
              styles.pendingInfo
            }
          >
            <View
              style={
                styles.pendingRow
              }
            >
              <Typography
                variant="body"
                color={
                  Colors.TEXT_GRAY
                }
              >
                Property
              </Typography>

              <Typography
                variant="h3"
                style={
                  styles.pendingValue
                }
              >
                {
                  currentProperty
                    ?.title ??
                  '-'
                }
              </Typography>
            </View>

            <View
              style={
                styles.pendingRow
              }
            >
              <Typography
                variant="body"
                color={
                  Colors.TEXT_GRAY
                }
              >
                Room
              </Typography>

              <Typography
                variant="h3"
                style={
                  styles.pendingValue
                }
              >
                {
                  roomName ??
                  '-'
                }
              </Typography>
            </View>

            <View
              style={
                styles.pendingRow
              }
            >
              <Typography
                variant="body"
                color={
                  Colors.TEXT_GRAY
                }
              >
                Seat
              </Typography>

              <Typography
                variant="h3"
                style={
                  styles.pendingValue
                }
              >
                {
                  seatIndex ??
                  '-'
                }
              </Typography>
            </View>

            <View
              style={
                styles.pendingRow
              }
            >
              <Typography
                variant="body"
                color={
                  Colors.TEXT_GRAY
                }
              >
                Lease
              </Typography>

              <Typography
                variant="h3"
                style={
                  styles.pendingValue
                }
              >
                {fromDate} →{' '}
                {toDate}
              </Typography>
            </View>

            <View
              style={
                styles.pendingDivider
              }
            />

            <View
              style={
                styles.pendingTimerBox
              }
            >
              <Typography
                variant="body"
                color={
                  Colors.TEXT_GRAY
                }
              >
                Confirm within
              </Typography>

              <Typography
                variant="h1"
                style={
                  styles.timer
                }
              >
                {timerText}
              </Typography>
            </View>
          </View>

          {error && (
            <Typography
              color="#EF4444"
              style={
                styles.error
              }
            >
              {error}
            </Typography>
          )}

          <RegularButton
            Icon={
              <Lock
                color={
                  Colors.WHITE
                }
              />
            }
            loading={
              confirming
            }
            disable={
              confirming ||
              secondsRemaining <=
                0
            }
            onPress={
              confirmPendingBooking
            }
            text={
              secondsRemaining >
              0
                ? `Confirm ${formatNumberIntoCurrency(
                    total,
                  )}`
                : 'Booking expired'
            }
          />

          <Typography
            variant="caption"
            color={
              Colors.TEXT_GRAY
            }
            style={
              styles.footer
            }
          >
            Your seat remains
            pending until you
            confirm or the
            confirmation window
            expires.
          </Typography>
        </View>
      </View>
    );
  }

  /*
   * ----------------------------------------------------------
   * NORMAL BOOKING SCREEN
   * ----------------------------------------------------------
   */
  return (
    <View
      style={
        styles.container
      }
    >
      <ConfirmScreenHeader />

      <View
        style={
          styles.card
        }
      >
        {/* PROPERTY */}
        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Property
          </Typography>

          <Typography
            variant="h3"
            style={
              styles.value
            }
          >
            {
              currentProperty
                ?.title ??
              '-'
            }
          </Typography>
        </View>

        {/* ROOM */}
        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Room
          </Typography>

          <Typography
            variant="h3"
            style={
              styles.value
            }
          >
            {
              roomName ??
              '-'
            }
          </Typography>
        </View>

        {/* SEAT */}
        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Seat
          </Typography>

          <Typography
            variant="h3"
            style={
              styles.value
            }
          >
            {
              seatIndex ??
              '-'
            }
          </Typography>
        </View>

        {/* LEASE */}
        <View>
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Lease Period
          </Typography>

          <View
            style={
              styles.pickerRow
            }
          >
            <Picker
              selectedValue={
                fromDate
              }
              style={
                styles.picker
              }
              onValueChange={
                handleStartDateChange
              }
            >
              {Years.map(
                year =>
                  Months.map(
                    (
                      month,
                      monthIndex,
                    ) => {
                      /*
                       * Disable months
                       * before current
                       * month.
                       */
                      const isPast =
                        year ===
                          currentYear &&
                        monthIndex <
                          currentMonthIndex;

                      return (
                        <Picker.Item
                          key={`${year}-${month}-start`}
                          label={`${year}-${month}`}
                          value={`${year}-${month}`}
                          enabled={
                            !isPast
                          }
                        />
                      );
                    },
                  ),
              )}
            </Picker>

            <Typography
              variant="h1"
            >
              -
            </Typography>

            <Picker
              selectedValue={
                toDate
              }
              style={
                styles.picker
              }
              onValueChange={
                handleEndDateChange
              }
            >
              {Years.map(
                year =>
                  Months.map(
                    month => (
                      <Picker.Item
                        key={`${year}-${month}-end`}
                        label={`${year}-${month}`}
                        value={`${year}-${month}`}
                      />
                    ),
                  ),
              )}
            </Picker>
          </View>
        </View>

        {/* PRICE */}
        <View
          style={
            styles.divider
          }
        />

        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Price
          </Typography>

          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            {
              formatNumberIntoCurrency(
                pricePerSeat,
              )
            }{' '}
            × {duration}{' '}
            months
          </Typography>
        </View>

        {/* TOTAL */}
        <View
          style={
            styles.totalRow
          }
        >
          <Typography
            variant="h1"
          >
            Total
          </Typography>

          <Typography
            variant="h1"
          >
            {
              formatNumberIntoCurrency(
                total,
              )
            }
          </Typography>
        </View>

        {error && (
          <Typography
            color="#EF4444"
            style={
              styles.error
            }
          >
            {error}
          </Typography>
        )}
      </View>

      <RegularButton
        Icon={
          <Lock
            color={
              Colors.WHITE
            }
          />
        }
        loading={
          booking
        }
        disable={
          booking ||
          duration <= 0 ||
          pricePerSeat <= 0 ||
          seatIndex ===
            undefined ||
          seatIndex ===
            null
        }
        onPress={
          bookNow
        }
        text={`Reserve ${formatNumberIntoCurrency(
          total,
        )}`}
      />

      <Typography
        variant="caption"
        color={
          Colors.TEXT_GRAY
        }
        style={
          styles.footer
        }
      >
        Your booking will
        first be created as
        pending. You will
        then have a short
        confirmation window
        to confirm it.
      </Typography>
    </View>
  );
};

export default ConfirmBooking;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.WHITE,
      padding: 16,
      gap: 16,
    },

    card: {
      padding: 20,
      elevation: 2,
      borderRadius: 16,
      backgroundColor:
        Colors.WHITE,
      gap: 24,
    },

    row: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      gap: 16,
    },

    value: {
      flex: 1,
      textAlign:
        'right',
    },

    pickerRow: {
      flexDirection:
        'row',
      gap: 10,
      alignItems:
        'center',
      marginTop: 10,
    },

    picker: {
      flex: 1,
      backgroundColor:
        '#EEEEEE',
    },

    divider: {
      height: 0.5,
      backgroundColor:
        Colors.BORDER_GRAY,
    },

    totalRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    error: {
      textAlign:
        'center',
      marginTop: 4,
    },

    footer: {
      textAlign:
        'center',
      paddingHorizontal: 12,
    },

    /*
     * Pending booking UI
     */
    pendingCard: {
      padding: 24,
      borderRadius: 20,
      backgroundColor:
        Colors.WHITE,
      elevation: 3,
      gap: 18,
    },

    pendingIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignSelf:
        'center',
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F97316',
    },

    pendingTitle: {
      textAlign:
        'center',
      color:
        '#111827',
    },

    pendingSubtitle: {
      textAlign:
        'center',
    },

    pendingInfo: {
      marginTop: 4,
      padding: 16,
      borderRadius: 14,
      backgroundColor:
        '#F9FAFB',
      gap: 16,
    },

    pendingRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      gap: 12,
    },

    pendingValue: {
      flex: 1,
      textAlign:
        'right',
      color:
        '#111827',
    },

    pendingDivider: {
      height: 1,
      backgroundColor:
        '#E5E7EB',
    },

    pendingTimerBox: {
      alignItems:
        'center',
      gap: 4,
    },

    timer: {
      color:
        '#F97316',
      fontSize: 34,
      fontWeight:
        '800',
    },
  });