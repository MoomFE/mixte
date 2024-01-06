import { isPlainObject } from 'mixte';

function clone<T>(value: T, cache = new WeakMap<object, object>()) {
  const isObject = isPlainObject(value);
  let cloneValue: any = value;

  if (isObject || Array.isArray(value)) {
    if (cache.has(value))
      return cache.get(value);

    cache.set(
      value,
      cloneValue = isObject ? {} : [],
    );

    if (isObject) {
      Object.entries(value as object).forEach(([k, v]) => {
        cloneValue[k] = clone(v, cache);
      });
    }
    else {
      for (const iterator of value)
        cloneValue.push(clone(iterator, cache));
    }
  }

  return cloneValue;
}

/**
 * 创建传入值的深拷贝
 *  - 只会深拷贝普通对象和数组, 其他类型的值会直接被继承
 *
 * @see https://mixte.moomfe.com/mixte/deepClone
 * @example
 * const obj = {
 *   a: { b: 2 }
 * };
 *
 * const cloneObj = deepClone(obj);
 *
 * console.log(obj === cloneObj); // -> false
 * console.log(obj.a === cloneObj.a); // -> false
 */
export function deepClone<T>(value: T): T {
  return clone(value);
}
