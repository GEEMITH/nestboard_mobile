import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Property, RoomType } from '../types/properties'

export interface PropertyState {
  currentProperty?: Property,
  roomType?: RoomType[],
}

const initialState: PropertyState = {
  currentProperty: undefined,
  roomType: []
}

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    saveProperty: (state, action: PayloadAction<Property>) => {
      state.currentProperty = action.payload;
    },
    saveRoomTypes: (state, action: PayloadAction<RoomType[]>) => {
      state.roomType = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { saveProperty, saveRoomTypes } = propertySlice.actions

export default propertySlice.reducer