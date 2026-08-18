import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

export interface BookingDetails {
  roomId: string;
  roomName: string;
  seatIndex: number;
  pricePerSeat: string;
  date: string;
  duration: number;
  bookingId?: string;
}

export interface BookingState {
  data?: BookingDetails;
}

const initialState: BookingState = {
  data: undefined,
};

export const bookingSlice =
  createSlice({
    name: 'booking',

    initialState,

    reducers: {
      updateBookingDetails: (
        state,
        action: PayloadAction<BookingDetails>,
      ) => {
        state.data =
          action.payload;
      },

      setBookingId: (
        state,
        action: PayloadAction<string>,
      ) => {
        if (state.data) {
          state.data.bookingId =
            action.payload;
        }
      },

      clearBooking: state => {
        state.data =
          undefined;
      },
    },
  });

export const {
  updateBookingDetails,
  setBookingId,
  clearBooking,
} =
  bookingSlice.actions;

export default bookingSlice.reducer;