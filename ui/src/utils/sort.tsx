export const arrayOfObjectsSort = (arr: any, property: string, direction: 'asc' | 'desc') => {
  // const compareDirection = direction === 'asc' ? (a, b) => a <= b ? -1 : 1 : (a, b) => a <= b ? 1 : -1;
  const valueMatch = direction === 'asc' ? -1 : 1;
  const valueNoMatch = direction === 'asc' ? 1 : -1;
  const sorted = arr.sort((a: any, b: any) => {
    // 0 : equals, 1 : greater, -1: smaller
    if (!a[property]) return 1;
    if (!b[property]) return -1;
    return a[property] <= b[property] ? valueMatch : valueNoMatch;
  });

  return sorted;
};
