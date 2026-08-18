import { PropertyAPI } from "../api/properties";

export const getProperties = (
  page: number = 1,
) => {
  return PropertyAPI
    .getAllProperties({
      page,
      limit: 6,
      sort: "recency",
    })
    .then((data) => {
      return data;
    });
};
