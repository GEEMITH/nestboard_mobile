import { useEffect, useState } from "react"
import { propertyAPI } from "../api/properties"
import { Property } from "../types/properties"

export const useGetProperties = () => {

  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    propertyAPI.getAllProperties(page).then(data => {
      console.log("properties ", data)
      setProperties([...properties, ...data.data])
    });
  }, [])

  return {
    properties
  }

}