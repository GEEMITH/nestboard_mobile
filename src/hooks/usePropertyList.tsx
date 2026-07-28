import { useEffect, useState } from "react";
import { PropertyItem } from "../types/properties";
import { PropertyAPI } from "../api/properties";
import { PropertyType } from "../types/common";

export const usePropertyList = (currentPType: PropertyType, range: {
  min: number;
  max: number;
},
  checkedCities: {
    city: string;
    checked: boolean;
  }[],
  triggerFilter: number
) => {

  console.log("cu", currentPType)

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [fetching, setFetching] = useState(false);
  const limit = 4; // Fetch 4 items per batch
  const [properties, setProperties] = useState<PropertyItem[]>([])

  useEffect(() => {
    fetchFirstBatch();
  }, [currentPType, triggerFilter])

  const fetchFirstBatch = () => {
    setProperties([]);
    setPage(1)
    PropertyAPI.getAllProperties(page, limit, currentPType, range, checkedCities).then((d) => {
      setProperties(d.data)
      setHasNext(d.meta.hasNextPage)
      if (d.meta.hasNextPage) {
        setPage(p => p + 1)
      }
    }).catch(() => { })
  }

  const fetchNextBatch = () => {
    if (hasNext && !fetching) {
      setFetching(true);
      setTimeout(() => {
        PropertyAPI.getAllProperties(page, limit, currentPType, range, checkedCities).then((d) => {
          setProperties(oldlist => [...oldlist, ...d.data])
          setHasNext(d.meta.hasNextPage)
          setFetching(false);
          if (d.meta.hasNextPage) {
            setPage(p => p + 1)
          }
        }).catch(() => { })
      }, 0)
    }
  }

  return {
    properties,
    fetchNextBatch,
    fetching
  }

}