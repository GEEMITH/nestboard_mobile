export type ReviewUser = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

export type ReviewBooking = {
  id: string;
  leaseStart: string;
  leaseEnd: string;
};

export type Review = {
  id: string;
  propertyId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: ReviewUser;
  booking?: ReviewBooking;
};

export type ReviewEligibility = {
  eligible: boolean;
  reason:
    | 'ALREADY_REVIEWED'
    | 'NO_QUALIFYING_BOOKING'
    | null;
  booking?: ReviewBooking;
};

export type CreateReviewPayload = {
  rating: number;
  comment?: string;
  bookingId: string;
};