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

/**
 * 判断传入参数是否数字字符串
 *
 * @param value 需要判断的参数
 * @example
 *
 * isNumericString('666'); // -> true
 * isNumericString(666); // -> false
 * isNumericString(NaN); // -> false
 */
export function isNumericString(value: unknown): value is `${number}` {
  // @ts-expect-error
  return isString(value) && !Number.isNaN(value - Number.parseFloat(value));
}

/**
 * 判断传入参数是否是数字, 支持判断数字字符串
 *
 * @param value 需要判断的参数
 * @example
 *
 * isNumeric(666); // -> true
 * isNumeric('666'); // -> true
 * isNumeric(NaN); // -> false
 */
export function isNumeric(value: unknown): value is number | `${number}` {
  return isNumber(value) || isNumericString(value);
}
