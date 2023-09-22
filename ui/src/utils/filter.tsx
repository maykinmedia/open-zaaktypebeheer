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
 * Filter data by comparing an specified attribute value to the query.
 * @param query string
 * @param data array of Zaaktype or InformationObject
 * @param attribute attribute of Zaaktype or InformationObject
 * @returns filtered array
 */
export function attributeOnQueryFilter<T>(query: string, data: T[], attribute: keyof T) {
  if (!data) return data;
  return data.filter((dataItem) => {
    let valueFromAttribute = dataItem[attribute];
    if (typeof valueFromAttribute === 'string') return partStringCompare(valueFromAttribute, query);
  });
}
