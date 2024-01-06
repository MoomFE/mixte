import { isPlainObject } from 'mixte';
import type { MaybeRef, UnwrapNestedRefs } from 'vue-demi';
import { unref } from 'vue-demi';

/**
 * 方法 `unref` 的加强版本
 *  - 如果传入的是普通对象和数组, 会不断向下查找然后解包并返回传入对象的副本, 否则直接返回传入值的 `unref` 结果
 *
 * @see https://mixte.moomfe.com/mixte/use/deepUnref
 * @example
 * const source = {
 *   a: ref(1),
 *   b: computed(() => [
 *     ref(2),
 *     computed(() => 3),
 *   ]),
 *   c: 4,
 * };
 *
 * console.log(deepUnref(source)); // -> { a: 1, b: [ 2, 3 ], c: 4 }
 */
export function deepUnref<T>(maybeRef: MaybeRef<T>): UnwrapNestedRefs<T> {
  const value = unref(maybeRef);

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepUnref(v)]),
    ) as any;
  }

  if (Array.isArray(value))
    return value.map(item => deepUnref(item)) as any;

  return value as any;
}
