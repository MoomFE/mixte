import { randomString } from '../random/index';

/**
 * uniqueKey 方法默认的 key 生成器
 *  - 返回长度为 18 且首字母不为数字的字符串
 */
export function uniqueKeyCustomizer() {
  return randomString(1, { uppercase: true }) + randomString(17, { uppercase: true, number: true });
}

/**
 * 为数组中对象的某个字段生成一个唯一的 key
 * @param arr 需要生成唯一 key 的数组
 * @param key 字段名 ( default: 'id' )
 * @param customizer key 生成器 ( default: uniqueKeyCustomizer )
 * @returns
 */
export function uniqueKey<T = string>(
  arr: any[],
  key: PropertyKey = 'id',
  customizer: (() => T) = uniqueKeyCustomizer as (() => T),
) {
  if (!Array.isArray(arr)) throw new Error('???');

  let value: T;

  while (true) {
    value = customizer();

    if (!arr.some(item => item[key] === value))
      break;
  }

  return value;
}
