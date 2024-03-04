import { partStringCompare } from './compare';

/**
 * Filter an array of strings based on a query.
 * @param query string
 * @param array array of strings
 * @returns filtered array
 */
export function onQueryFilter(query: string, array: string[]) {
  return array.filter((item) => {
    return partStringCompare(item, query);
  });
}

/**
 * Filter data by comparing one or more attribute values to the query.
 * @param query string
 * @param data array of Zaaktype or InformationObject
 * @param attributes attribute or attributes of Zaaktype or InformationObject
 * @returns filtered array
 */
export function attributeOnQueryFilter<T>(
  query: string,
  data: T[],
  attributes: keyof T | (keyof T)[]
) {
  if (!data) return data;
  return data.filter((dataItem) => {
    // Array of attributes
    if (Array.isArray(attributes))
      return attributes.find((attribute) => {
        const value = dataItem[attribute];
        return partStringCompare(String(value), query);
      });

    // Single attribute
    const value = dataItem[attributes];
    return partStringCompare(String(value), query);
  });
}
