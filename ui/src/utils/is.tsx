export const isLink = (value: string) => value?.includes('http');

export const isEmpty = (value: unknown) => {
  if (!value && value !== false) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  else return false;
};

export const isBoolean = (value: unknown) => typeof value === 'boolean';

export const isObject = (value: unknown) => typeof value === 'object';

export const isValue = (value: any) => {
  if (Array.isArray(value)) return 'array';
  if (isObject(value)) return 'object';
  if (isBoolean(value)) return 'boolean';
  if (isLink(value)) return 'url';
  return 'string';
};
