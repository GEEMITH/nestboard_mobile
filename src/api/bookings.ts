import {
  apiClient,
} from './apiClient';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

export type Booking = {
  id: string;

  seatIndex: number;

  leaseStart: string;

  leaseEnd: string;

  duration: number;

  totalAmount: number;

  status: BookingStatus;

  paymentStatus: PaymentStatus;

  createdAt: string;

  room: {
    id: string;

    name: string;

    roomType: {
      id: string;

      name: string;

      pricePerMonth: string;

      property: {
        id: string;

        title: string;

        city?: string;

        imageUrl?: string;
      };
    };
  };
};

export const BookingAPI = {
  /*
   * Creates a PENDING booking.
   *
   * IMPORTANT:
   * The backend calculates totalAmount itself.
   */
  createBooking: async (
    roomId: string,
    seatNumber: number,
    startMonth: string,
    durationMonths: number,
  ) => {
    const response =
      await apiClient.post<Booking>(
        'bookings',
        {
          roomId,

          seatNumber,

          startMonth,

          durationMonths,
        },
      );

    return response.data;
  },

  /*
   * Confirms an existing pending booking.
   */
  confirmBooking: async (
    bookingId: string,
  ) => {
    const response =
      await apiClient.post<Booking>(
        `bookings/${bookingId}/confirm`,
      );

    return response.data;
  },

  cancelBooking: async (
    bookingId: string,
  ) => {
    const response =
      await apiClient.post<Booking>(
        `bookings/${bookingId}/cancel`,
      );

    return response.data;
  },

  getMyBookings: async () => {
    const response =
      await apiClient.get<Booking[]>(
        'bookings/my',
      );

    return response.data;
  },

  /*
   * Backward-compatible helper.
   */
  bookProperty: async (
    roomId: string,
    seatIndex: number,
    date: string,
    period: number,
    _total: string,
  ) => {
    return BookingAPI.createBooking(
      roomId,
      seatIndex,
      date,
      period,
    );
  },
};