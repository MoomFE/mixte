import type { Get } from 'type-fest';

const PATH_ARRAY_REGEXP = /\[(\d+)\]/g;
const PATH_ARRAY_INDEX_REGEXP = /^\d+$/;

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 根据路径获取对象属性值, 若路径不存在则返回默认值
 *
 * @see https://mixte.moomfe.com/mixte/get#get
 * @param obj 目标对象
 * @param path 属性路径, 支持 a.b[0].c
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
  obj: T,
  path: P,
  defaultValue?: D,
): Get<T, P> | D {
  if (obj == null)
    return defaultValue as D;

  const pathArr = `${path}`
    .replace(PATH_ARRAY_REGEXP, '.$1')
    .split('.');

  let result: any = obj;

  for (const key of pathArr) {
    // 使用 hasOwnProperty 判断, 避免读取到原型链上的属性
    if (result != null && hasOwnProperty.call(result, key)) {
      result = result[key];
    }
    else {
      return defaultValue as D;
    }
  }

  return result === undefined ? defaultValue as D : result;
}

/**
 * 根据路径设置对象属性值, 若路径不存在则自动创建
 *
 * @see https://mixte.moomfe.com/mixte/get#set
 * @param obj 目标对象
 * @param path 属性路径, 支持 `a.b`, `x.y[2].z`, `a.b[0].d.e` 等形式
 * @param value 要设置的值
 * @example
 *
 * const obj1 = {};
 * set(obj1, 'a.b', 5);
 * // obj1 => { a: { b: 5 } }
 *
 * const obj2 = {};
 * set(obj2, 'x.y[2].z', 'hello');
 * // obj2 => { x: { y: [undefined, undefined, { z: 'hello' }] } }
 *
 * const obj3 = { a: { b: [{ c: 1 }] } };
 * set(obj3, 'a.b[0].d.e', true);
 * // obj3 => { a: { b: [ { c: 1, d: { e: true } } ] } }
 */
export function set<T extends object = any>(
  obj: T,
  path: string,
  value: any,
): void {
  if (obj == null)
    return;

  const pathArr = `${path}`
    .replace(PATH_ARRAY_REGEXP, '.$1')
    .split('.');

  let result: any = obj;

  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];

    // 拒绝 `__proto__` 路径, 避免通过原型链篡改原型 ( 原型污染 )
    if (key === '__proto__') return;

    // 当前值不是对象时无法继续设置属性, 直接中断
    if (result === null || (typeof result !== 'object' && typeof result !== 'function')) return;

    // 最后一个 key, 赋值
    if (i === pathArr.length - 1) {
      result[key] = value;
    }
    else {
      // 下一个 key 是否为数字, 决定是否创建数组
      const nextKey = pathArr[i + 1];
      const isArray = PATH_ARRAY_INDEX_REGEXP.test(nextKey);

      // 使用 hasOwnProperty 判断, 避免命中原型链上的同名属性
      if (!hasOwnProperty.call(result, key) || result[key] == null) {
        result[key] = isArray
          ? Array.from({ length: +nextKey })
          : {};
      }

      result = result[key];
    }
  }
}
