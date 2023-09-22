import decamelize from 'decamelize';

/**
 * Uppercase the first letter of a string.
 * @param string the string of which the first letter should be capitalized
 * @returns the string with the first letter capitalized
 */
export const ucFirstText = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Decamelize a string.
 * @param string the string to decamelize
 * @param noUcFirst if true, the first letter will not be capitalized
 * @param separator the separator to use, defaults to a space
 * @returns the decamelized string
 */
export const decamelizeText = (string: string, noUcFirst?: true, separator?: string) => {
  if (!noUcFirst)
    return ucFirstText(decamelize(string, { separator: separator ? separator : ' ' }));
  return decamelize(string, { separator: separator });
};

export const widthText = (string: string, xWidth: number) => {
  return 30 + Array.from(string).length * xWidth;
};
