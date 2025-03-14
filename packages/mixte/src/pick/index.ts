import { toArray } from 'mixte';

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
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[] | K): Pick<T, K> {
  if (!obj) return {} as Pick<T, K>;

  const result = {} as Pick<T, K>;
  const keysArray = toArray(keys);

  for (const key of keysArray) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
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
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[] | K): Omit<T, K> {
  if (!obj) return {} as Omit<T, K>;

  const result = { ...obj };
  const keysArray = toArray(keys);

  for (const key of keysArray) {
    delete result[key];
  }

  return result as Omit<T, K>;
}
