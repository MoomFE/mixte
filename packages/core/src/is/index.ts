/**
 * 判断传入参数是否是 String 类型
 *
 * @param value 需要判断的参数
 * @example
 *
 * isString('666'); // -> true
 * isString(666); // -> false
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * 判断传入参数是否是 Number 类型, 并且不为 NaN
 *
 * @param value 需要判断的参数
 * @example
 *
 * isNumber(666); // -> true
 * isNumber('666'); // -> false
 * isNumber(NaN); // -> false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && value === value; // eslint-disable-line no-self-compare
}
