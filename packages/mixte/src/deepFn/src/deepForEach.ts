import type { PartialDeep } from 'type-fest';
import type { DeepArray, FindOptions, Options } from './deepFind';
import { isFunction, isObject } from 'mixte';

/**
 * 在嵌套数据结构中深度遍历所有元素，并为每个元素执行回调函数
 *
 *
 * @see https://mixte.moomfe.com/mixte/deepFn#deepForEach
 * @param data - 要遍历的嵌套数据结构数组
 * @param callback - 对每个元素执行的回调函数
 * @example
 *
 * const data = [
 *   // 嵌套数据结构
 *   { id: 1 },
 *   {
 *     id: 2,
 *     children: [
 *       { id: 3 },
 *       { id: 4, children: [{ id: 5 }] },
 *     ],
 *     items: [
 *       { id: 6 },
 *       { id: 7, items: [{ id: 8 }] },
 *     ],
 *   },
 *   // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
 *   [
 *     { id: 9 },
 *     [
 *       {
 *         id: 10,
 *         children: [{ id: 11 }],
 *         items: [{ id: 12 }],
 *       },
 *     ],
 *   ],
 * ];
 *
 * // 嵌套数据结构
 * deepForEach(data, item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'children', item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'items', item => console.log(item.id)); // -> 1, 2, 6, 7, 8
 * // 嵌套数组结构
 * deepForEach(data, item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 3, 4, 5, 9, 10, 11
 * deepForEach(data, 'children', item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 3, 4, 5, 9, 10, 11
 * deepForEach(data, 'items', item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 6, 7, 8, 9, 10, 12
 */
export function deepForEach<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  callback: (value: PartialDeep<Item>) => void,
  options?: Options,
): void;

/**
 * 在嵌套数据结构中深度遍历所有元素，并为每个元素执行回调函数
 *
 *
 * @see https://mixte.moomfe.com/mixte/deepFn#deepForEach
 * @param data - 要遍历的嵌套数据结构数组
 * @param childrenKey - 子项数组的键名
 * @param callback - 对每个元素执行的回调函数
 * @example
 *
 * const data = [
 *   // 嵌套数据结构
 *   { id: 1 },
 *   {
 *     id: 2,
 *     children: [
 *       { id: 3 },
 *       { id: 4, children: [{ id: 5 }] },
 *     ],
 *     items: [
 *       { id: 6 },
 *       { id: 7, items: [{ id: 8 }] },
 *     ],
 *   },
 *   // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
 *   [
 *     { id: 9 },
 *     [
 *       {
 *         id: 10,
 *         children: [{ id: 11 }],
 *         items: [{ id: 12 }],
 *       },
 *     ],
 *   ],
 * ];
 *
 * // 嵌套数据结构
 * deepForEach(data, item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'children', item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'items', item => console.log(item.id)); // -> 1, 2, 6, 7, 8
 * // 嵌套数组结构
 * deepForEach(data, item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 3, 4, 5, 9, 10, 11
 * deepForEach(data, 'children', item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 3, 4, 5, 9, 10, 11
 * deepForEach(data, 'items', item => console.log(item.id), { nestedArray: true }); // -> 1, 2, 6, 7, 8, 9, 10, 12
 */
export function deepForEach<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  childrenKey: ChildrenKey,
  callback: (value: PartialDeep<Item>) => void,
  options?: Options,
): void;

export function deepForEach<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  Callback extends (value: PartialDeep<Item>) => void,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  param1: ChildrenKey | Callback,
  param2?: Callback | Options,
  param3?: Options,
): void {
  if (isFunction(param1)) {
    forEach(data, param1 as Callback, param2 as Options);
  }
  else {
    forEach(data, param2 as Callback, {
      ...param3,
      childrenKey: param1 as ChildrenKey,
    });
  }
}

function forEach<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  callback: (value: PartialDeep<Item>) => void,
  options?: FindOptions<ChildrenKey>,
): void {
  if (!data?.length) return;

  const childrenKey = options?.childrenKey ?? 'children';
  const cache = options?.cache ?? new WeakMap<Item, boolean>();
  const nestedArray = options?.nestedArray ?? false;

  for (const item of data) {
    if (Array.isArray(item)) {
      if (!nestedArray) continue;

      return forEach(item, callback, {
        childrenKey,
        cache,
        nestedArray,
      });
    }

    if (isObject(item)) {
      if (cache.has(item))
        continue;

      cache.set(item, true);

      callback(item);

      const children = item[childrenKey as keyof typeof item];

      if (Array.isArray(children) && children.length) {
        forEach(children, callback, {
          childrenKey,
          cache,
          nestedArray,
        });
      }
    }
  }
}
