import { isPlainObject } from 'mixte';
import type { Merge } from 'type-fest';

function merge<T, S>(target: T, source: S) {
  if (!isPlainObject(source) && !Array.isArray(source)) return;

  for (const [key, value] of Object.entries(source)) {
    let isArray = false;

    if (isPlainObject(value) || (isArray = Array.isArray(value))) {
      let targetValue;
      const cloneValue: any = isArray ? [] : (isPlainObject(targetValue = target[key as keyof T]) ? targetValue : {});

      merge(cloneValue, value);

      target[key as keyof T] = cloneValue;
    }
    else if (value !== undefined) {
      target[key as keyof T] = value;
    }
  }
}

export function deepMerge<T>(target: T): T;
export function deepMerge<T, S1>(target: T, source: S1): Merge<T, S1>;
export function deepMerge<T, S1, S2>(target: T, source: S1, source2: S2): Merge<Merge<T, S1>, S2>;
export function deepMerge<T, S1, S2, S3>(target: T, source: S1, source2: S2, source3: S3): Merge<Merge<Merge<T, S1>, S2>, S3>;
export function deepMerge<T, S1, S2, S3, S4>(target: T, source: S1, source2: S2, source3: S3, source4: S4): Merge<Merge<Merge<Merge<T, S1>, S2>, S3>, S4>;
export function deepMerge<T, S1, S2, S3, S4, S5>(target: T, source: S1, source2: S2, source3: S3, source4: S4, source5: S5): Merge<Merge<Merge<Merge<Merge<T, S1>, S2>, S3>, S4>, S5>;
export function deepMerge<T, S1, S2, S3, S4, S5, S6>(target: T, source: S1, source2: S2, source3: S3, source4: S4, source5: S5, source6: S6): Merge<Merge<Merge<Merge<Merge<Merge<T, S1>, S2>, S3>, S4>, S5>, S6>;

/**
 * 深拷贝合并一个或多个来源对象 `sources` 的属性到目标对象 `target`
 *  - 来源对象从左到右进行深拷贝, 后续的来源对象会覆盖之前拷贝的属性
 *  - 来源对象中值为 `undefined` 的属性会被跳过
 *  - 来源对象中普通对象将会递归合并, 数组会被深拷贝后继承, 其他对象将会直接继承
 *  - 目标对象或来源对象的类型为数组时, 也遵循以上规则
 * @param target 目标对象
 * @param sources 来源对象
 */
export function deepMerge<T, S>(target: T, ...sources: S[]) {
  if ((!isPlainObject(target) && !Array.isArray(target)) || !sources.length)
    return target;

  for (const source of sources)
    merge(target, source);

  return target;
}
