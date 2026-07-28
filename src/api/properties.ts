import { PropertyType } from "../types/common";
import { Property, PropertyItem, PropertyListResponse, PropertyLocation, RoomType } from "../types/properties";
import { apiClient } from "./apiClient"

export const PropertyAPI = {

  getAllProperties: async (page: number, limit: number,
    type: PropertyType, range: {
      min: number;
      max: number;
    },
    checkedCities: {
      city: string;
      checked: boolean;
    }[]) => {
    const params = new URLSearchParams();
    params.append("page", page + "");
    params.append("limit", limit + "");
    params.append('type', type.toLocaleLowerCase())

    if (range.min > 0 && range.max > 0) {
      params.append('minPrice', range.min + "")
      params.append('maxPrice', range.max + "")
    }

    // [
    //   {
    //     "city": "Colombo",
    //     checked: true
    //   },
    //   {
    //     "city": "Galle",
    //     checked: true
    //   },
    //   {
    //     "city": "Kiribathgoda",
    //     checked: true
    //   },
    // ]
    // [colombo,galle,Kiribathgoda]
    //     [  colombo,galle,Kiribathgoda]
    //colombo,galle,Kiribathgoda ]
    //colombo,galle,Kiribathgoda
    if ((checkedCities.map(obj => obj.city) + "").length > 1) {
      console.log("list ", (checkedCities.map(obj => obj.city) + ""))
      console.log("extracted citied ", (checkedCities.map(obj => obj.city) + ""))
      if (checkedCities.length > 0) {
        params.append('city', (checkedCities.map(obj => obj.city) + ""))
      }
    }
    //properties?page=1&limit=4&abc=xyz

    const d = await apiClient.get<PropertyListResponse>('properties?' + params.toString())
    return d.data;
  },

  getSingleProperty: async (id: string) => {
    const d = await apiClient.get<Property>('properties/' + id)
    return d.data;
  },

  getPropertyRoomTypes: async (id: string) => {
    const d = await apiClient.get<RoomType[]>('properties/' + id + '/room-types')
    return d.data;
  },

  getSingleRoomType: async (proprtyId: string, roomTypeId: string) => {
    const d = await apiClient.get<RoomType>(`properties/${proprtyId}/room-types/${roomTypeId}`)
    return d.data;
  },

  getMapList: async () => {
    const d = await apiClient.get<PropertyLocation[]>(`properties/map-list`)
    return d.data;
  },

}