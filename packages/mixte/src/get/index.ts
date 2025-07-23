import type { Get } from 'type-fest';

/**
 * 根据路径获取对象属性值，若路径不存在则返回默认值
 *
 * @see https://lodash.com/docs/4.17.15#get
 * @param object 目标对象
 * @param path 属性路径，支持 a.b[0].c
 * @param defaultValue 路径不存在时返回的默认值
 * @example
 *
 * const obj = {
 *   a: {
 *     b: [{ c: 3 }]
 *   },
 *   d: { e: 5 }
 * };
 *
 * get(obj, 'd.e'); // -> 5
 * get(obj, 'a.b[0].c'); // -> 3
 * get(obj, 'a.b[1].c', 'default'); // -> 'default'
 */

export function get<T = any, P extends string = string, D = undefined>(
  object: T,
  path: P,
  defaultValue?: D,
): Get<T, P> | D {
  if (object == null)
    return defaultValue as D;

  if (path === '' || path == null)
    return object as any;

  const pathArr = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.');

  let result: any = object;

  for (const key of pathArr) {
    if (result != null && key in result) {
      result = result[key];
    }
    else {
      return defaultValue as D;
    }
  }

  return result === undefined ? defaultValue as D : result;
}
