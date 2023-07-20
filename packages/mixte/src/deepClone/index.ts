import { isPlainObject } from 'mixte';

function clone<T>(value: T, cache = new WeakMap<object, object>()) {
  const isArray = Array.isArray(value);
  let cloneValue: any = value;

  if (isArray || isPlainObject(value)) {
    if (cache.has(value))
      return cache.get(value);

    cache.set(
      value,
      cloneValue = isArray ? [] : {},
    );

    if (isArray) {
      for (const iterator of value)
        cloneValue.push(clone(iterator, cache));
    }
    else {
      Object.entries(value as object).forEach(([k, v]) => {
        cloneValue[k] = clone(v, cache);
      });
    }
  }

  return cloneValue;
}

/**
 * 创建传入值的深拷贝
 *  - 只会深拷贝普通对象和数组, 其他类型的值会直接被继承
 */
export function deepClone<T>(value: T): T {
  return clone(value);
}
