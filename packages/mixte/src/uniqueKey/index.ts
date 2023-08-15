import { randomString } from '../random/index';

/**
 * uniqueKey 方法默认的 key 生成器
 *  - 返回长度为 18 且首字母不为数字的字符串
 * @example
 * uniqueKeyCustomizer(); // -> 'b3Ll5Kw6gQF5ens0H3'
 * uniqueKeyCustomizer(); // -> 'L1U1NsxTIEEKG098pB'
 * uniqueKeyCustomizer(); // -> 'Y8j5JqmvnICB24GUou'
 * uniqueKeyCustomizer(); // -> 'H6TK7p1M9zJ32HOfzE'
 */
export function uniqueKeyCustomizer() {
  return randomString(1, { uppercase: true }) + randomString(17, { uppercase: true, number: true });
}

/**
 * 为数组中对象的某个字段生成一个唯一的 key
 *  - 可用于为新增的数据生成唯一 key
 * @param arr 需要生成唯一 key 的数组
 * @param key 字段名 ( default: 'id' )
 * @param customizer key 生成器 ( default: uniqueKeyCustomizer )
 * @example
 * const arr = [{ id: '1' }, { id: '2' }];
 *
 * arr.push({
 *   id: uniqueKey(arr), // -> 'qCy7oZjp3CcDB6NMQ4'
 * });
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
