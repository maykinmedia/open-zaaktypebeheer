export const uuidExtract = (str: string) => {
  const uuidInRegEx = /([a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8})/gi;
  const found = str.match(uuidInRegEx);
  if (!found) return null;
  return found[0];
};
