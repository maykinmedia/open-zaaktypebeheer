export const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
};

export const setLocalStorage = (key: string, value: any) => {
  const stringifiedValue = JSON.stringify(value);
  localStorage.setItem(key, stringifiedValue);
};
