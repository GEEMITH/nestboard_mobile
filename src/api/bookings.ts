import { Property, PropertyItem, PropertyListResponse, RoomType } from "../types/properties";
import { apiClient } from "./apiClient"

export const BookingAPI = {
  bookProperty: async (
    roomId: string,
    seatIndex: number,
    date: string,
    period: number,
    total: string
  ) => {
    //properties?page=1&limit=4&abc=xyz

    await apiClient.put<PropertyListResponse>('bookings', {
      roomId,
      seatIndex,
      date,
      period,
      total: parseFloat(total)
    })
    // return d.data;
  }
}