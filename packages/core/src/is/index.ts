import type { EmptyObject } from 'type-fest';

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

/**
 * 判断传入参数是否是 Object 类型, 并且不为 null
 *
 * @param value 需要判断的参数
 * @example
 *
 * isObject({}); // -> true
 * isObject([]); // -> true
 * isObject(() => {}); // -> false
 * isObject(function() {}); // -> false
 * isObject(666); // -> false
 */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

/**
 * 判断传入参数是否是纯粹的对象
 *
 * @param value 需要判断的参数
 * @example
 *
 * isPlainObject({}); // -> true
 * isPlainObject(Object.create(null)); // -> true
 * isPlainObject([]); // -> false
 */
export function isPlainObject<Value = unknown>(value: unknown): value is Record<PropertyKey, Value> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 判断传入对象是否是一个空对象
 * @param value 需要判断的参数
 * @example
 *
 * isEmptyObject({}); // -> true
 * isEmptyObject({ mixte: 6 }); // -> false
 */
export function isEmptyObject(value: any): value is EmptyObject {
  // eslint-disable-next-line no-unreachable-loop
  for (const a in value) return false;
  return true;
}
