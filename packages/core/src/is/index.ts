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
