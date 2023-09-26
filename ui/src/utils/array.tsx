/**
 * Create array from results attributes
 * @param data array of objects
 * @returns array of attributes
 */
export const attributesFromDataArray = (data: any[]) => {
  const propertiesArray = new Set<string>();

  // Iterate through each object
  for (const obj of data) {
    // Iterate through each key of the object and add it to the set
    Object.keys(obj).forEach((key) => propertiesArray.add(key));
  }
  return Array.from(propertiesArray);
};

/**
 * Return an unique array
 * @param array array to make unique
 * @returns unique array
 */
export const uniqueArray = (array: any[]) => Array.from(new Set(array));
