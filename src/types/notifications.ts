export type NotificationBooking = {
  id: string;
  bookingStatus: string;
  paymentStatus: string;
  leaseStart: string;
  leaseEnd: string;
};

export type NotificationProperty = {
  id: string;
  title: string;
  imageUrl: string | null;
};

export type AppNotification = {
  id: string;
  userId: string;
  bookingId: string | null;
  propertyId: string | null;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  booking?: NotificationBooking | null;
  property?: NotificationProperty | null;
};