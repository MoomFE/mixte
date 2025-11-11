import type { Paths, PickDeep } from 'type-fest';
import { get, set, toArray } from 'mixte';

/**
 * 从对象中选择指定属性
 *
 * @see https://mixte.moomfe.com/mixte/pick#pick
 * @param obj 对象
 * @param keys 要选择的属性，可以是数组或单个键
 * @example
 *
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // -> { a: 1, c: 3 }
 * pick({ a: 1, b: 2, c: 3 }, 'a'); // -> { a: 1 }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: (K | (string & {}))[] | readonly (K | (string & {}))[] | (K | (string & {})),
): Pick<T, K> {
  if (!obj) return {} as Pick<T, K>;

  const result: Record<string, any> = {};
  const keysArray = toArray(keys);

  for (const key of keysArray) {
    if (key as keyof T in obj) {
      result[key as string] = obj[key as keyof T];
    }
  }

  return result as Pick<T, K>;
}

/**
 * 从对象中排除指定属性
 *
 * @see https://mixte.moomfe.com/mixte/pick#omit
 * @param obj 对象
 * @param keys 要排除的属性，可以是数组或单个键
 * @example
 *
 * omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // -> { b: 2 }
 * omit({ a: 1, b: 2, c: 3 }, 'a'); // -> { b: 2, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: (K | (string & {}))[] | readonly (K | (string & {}))[] | (K | (string & {})),
): Omit<T, K> {
  if (!obj) return {} as Omit<T, K>;

  const result = { ...obj };
  const keysArray = toArray(keys);

  for (const key of keysArray) {
    delete result[key as keyof T];
  }

  return result as Omit<T, K>;
}

/**
 * 从对象中选择指定的深层属性
 *
 * @see https://mixte.moomfe.com/mixte/pick#pickdeep
 * @param obj 对象
 * @param keys 要选择的属性路径, 可以是数组或单个路径字符串
 *
 * @example
 *
 * const obj = {
 *   a: {
 *     b: 2,
 *     c: 3
 *   },
 *   d: 4
 * };
 *
 * pickDeep(obj, ['a.b', 'd']); // -> { a: { b: 2 }, d: 4 }
 * pickDeep(obj, 'a.c'); // -> { a: { c: 3 } }
 */
export function pickDeep<
  T extends object,
  K extends Paths<T, {
    maxRecursionDepth: 10;
    bracketNotation: false;
    leavesOnly: false;
  }>,
>(
  obj: T,
  keys: (K | (string & {}))[] | readonly (K | (string & {}))[] | (K | (string & {})),
): PickDeep<T, K> {
  if (!obj) return {} as PickDeep<T, K>;

  const result: Record<string, any> = {};
  const keysArray = toArray<string>(keys as string | string[]);

  for (const rawPath of keysArray) {
    set(result, rawPath, get(obj, rawPath));
  }

  return result as PickDeep<T, K>;
}
