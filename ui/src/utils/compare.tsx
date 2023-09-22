/**
 * Compare a part of a string with another string
 * @param str1 string to compare
 * @param str2 string to compare with
 * @returns boolean; true if str1 contains str2 else false
 */
export function partStringCompare(str1: string, str2: string) {
  return str1.toLowerCase().includes(str2.toLowerCase());
}

/**
 * Compare a string to another string
 * @param str1 string to compare
 * @param str2 string to compare with
 * @returns boolean; true str1 is equal to str2 else false
 */
export function exactStringCompare(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase();
}
