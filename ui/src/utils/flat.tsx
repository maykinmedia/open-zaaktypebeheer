export function flat(objectToFlat: any, flattedObject: any = {}, oldKey?: any) {
  for (let keyFromObject in objectToFlat) {
    if (flattedObject[keyFromObject]) {
      flattedObject[oldKey + '_' + keyFromObject] = objectToFlat[keyFromObject];
    } else if (typeof objectToFlat[keyFromObject] === 'object') {
      flat(objectToFlat[keyFromObject], flattedObject, keyFromObject);
    } else {
      flattedObject[keyFromObject] = objectToFlat[keyFromObject];
    }
  }
  return flattedObject;
}
