export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

export interface Booking {
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
}