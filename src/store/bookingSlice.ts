import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BookingDetails {
  roomId: string,
  roomName: string,
  seatIndex: number,
  pricePerSeat: string,
  date: string,
  duration: number
}

export interface BookingState {
  data?: BookingDetails
}

const initialState: BookingState = {
  data: undefined
}

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBookingDetails: (state, action: PayloadAction<BookingDetails>) => {
      state.data = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateBookingDetails } = bookingSlice.actions

export default bookingSlice.reducer