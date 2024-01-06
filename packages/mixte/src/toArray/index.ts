/**
 * 转换传入参数为数组
 *
 * @see https://mixte.moomfe.com/mixte/toArray
 * @param value 需要转换的参数
 * @example
 *
 * toArray(); // -> []
 * toArray(null); // -> []
 * toArray(undefined); // -> []
 * toArray(666); // -> [666]
 * toArray([666]); // -> [666]
 */
export function toArray<T>(value?: T | T[]): T[] {
  value = value ?? [];

  if (Array.isArray(value))
    return value;

  return [value];
}
