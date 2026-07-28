import { useEffect, useState } from "react"
import { PropertyAPI } from "../api/properties"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { RoomType } from "../types/properties"

export const useRoomTypeDetails = (roomTypeId: string) => {

  const currentProperty = useSelector((state: RootState) =>
    state.property.currentProperty
  )

  const [roomType, setRoomType] = useState<RoomType>()

  useEffect(() => {
    if (currentProperty) {
      PropertyAPI.getSingleRoomType(currentProperty.id, roomTypeId).
        then(details => {
          setRoomType(details)
        })
    }
  }, [])

  return {
    roomType
  }

}