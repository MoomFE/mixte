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
 * 判断传入参数是否是 Function 类型
 *
 * @param value 需要判断的参数
 * @example
 *
 * isFunction(() => {}); // -> true
 * isFunction(function() {}); // -> true
 * isFunction({}); // -> false
 * isFunction([]); // -> false
 * isFunction(666); // -> false
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * 判断传入参数是否是 Promise 对象
 *
 * @param value 需要判断的参数
 * @example
 *
 * isNativePromise(new Promise(() => {})) // -> true
 * isNativePromise(Promise.resolve()) // -> true
 * isNativePromise({ then() {}, catch() {} }) // -> false
 */
export function isNativePromise<T = unknown>(value: unknown): value is Promise<T> {
  return Object.prototype.toString.call(value) === '[object Promise]';
}

/**
 * 判断传入参数是否是 Promise 对象或是类似于 Promise 的对象
 *
 * @param value 需要判断的参数
 * @example
 *
 * isPromise(new Promise(() => {})) // -> true
 * isPromise(Promise.resolve()) // -> true
 * isPromise({ then() {}, catch() {} }) // -> true
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return isNativePromise(value) || (
    isFunction((value as Promise<T>)?.then) && isFunction((value as Promise<T>)?.catch)
  );
}

/**
 * 判断传入参数是否是引用类型
 *
 * @param value 需要判断的参数
 * @example
 *
 * isReference({}); // -> true
 * isReference([]); // -> true
 * isReference(() => {}); // -> true
 * isReference(function() {}); // -> true
 * isReference(undefined); // -> false
 * isReference(null); // -> false
 * isReference(true); // -> false
 * isReference(false); // -> false
 * isReference(666); // -> false
 * isReference(NaN); // -> false
 * isReference('666'); // -> false
 * isReference(Symbol('666')); // -> false
 * isReference(666n); // -> false
 */
export function isReference(value: unknown): value is object | Function {
  return isObject(value) || isFunction(value);
}

/**
 * 判断传入参数是否是原始类型
 *
 * @param value 需要判断的参数
 * @example
 *
 * isPrimitive(undefined); // -> true
 * isPrimitive(null); // -> true
 * isPrimitive(true); // -> true
 * isPrimitive(false); // -> true
 * isPrimitive(666); // -> true
 * isPrimitive(NaN); // -> true
 * isPrimitive('666'); // -> true
 * isPrimitive(Symbol('666')); // -> true
 * isPrimitive(666n); // -> true
 * isPrimitive({}); // -> false
 * isPrimitive([]); // -> false
 * isPrimitive(() => {}); // -> false
 * isPrimitive(function() {}); // -> false
 */
export function isPrimitive(value: unknown) {
  return !isReference(value);
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
