import type { PartialDeep } from 'type-fest';
import type { DeepArray, FindOptions, Options } from './deepFind';
import { isFunction, isObject } from 'mixte';

/**
 * 在嵌套数据结构中深度检查是否存在满足条件的元素, 如果存在返回 true, 否则返回 false
 *
 *
 * @see https://mixte.moomfe.com/mixte/deepFn#deepSome
 * @param data - 要搜索的嵌套数据结构数组
 * @param predicate - 判断函数, 用于确定是否找到目标元素
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
 * deepSome(data, item => item.id === 5); // -> true
 * deepSome(data, 'children', item => item.id === 5); // -> true
 * deepSome(data, 'items', item => item.id === 8); // -> true
 * deepSome(data, item => item.id === 8); // -> false
 * // 嵌套数组结构
 * deepSome(data, item => item.id === 9, { nestedArray: true }); // -> true
 * deepSome(data, 'children', item => item.id === 11, { nestedArray: true }); // -> true
 * deepSome(data, 'items', item => item.id === 12, { nestedArray: true }); // -> true
 * deepSome(data, item => item.id === 12, { nestedArray: true }); // -> false
 */
export function deepSome<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  predicate: (value: PartialDeep<Item>) => boolean,
  options?: Options,
): boolean;

/**
 * 在嵌套数据结构中深度检查是否存在满足条件的元素, 如果存在返回 true, 否则返回 false
 *
 *
 * @see https://mixte.moomfe.com/mixte/deepFn#deepSome
 * @param data - 要搜索的嵌套数据结构数组
 * @param childrenKey - 子项数组的键名
 * @param predicate - 判断函数, 用于确定是否找到目标元素
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
 * deepSome(data, item => item.id === 5); // -> true
 * deepSome(data, 'children', item => item.id === 5); // -> true
 * deepSome(data, 'items', item => item.id === 8); // -> true
 * deepSome(data, item => item.id === 8); // -> false
 * // 嵌套数组结构
 * deepSome(data, item => item.id === 9, { nestedArray: true }); // -> true
 * deepSome(data, 'children', item => item.id === 11, { nestedArray: true }); // -> true
 * deepSome(data, 'items', item => item.id === 12, { nestedArray: true }); // -> true
 * deepSome(data, item => item.id === 12, { nestedArray: true }); // -> false
 */
export function deepSome<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  childrenKey: ChildrenKey,
  predicate: (value: PartialDeep<Item>) => boolean,
  options?: Options,
): boolean;

export function deepSome<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  Predicate extends (value: PartialDeep<Item>) => boolean,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  param1: ChildrenKey | Predicate,
  param2?: Predicate | Options,
  param3?: Options,
): boolean {
  if (isFunction(param1)) {
    return some(data, param1 as Predicate, param2 as Options);
  }

  return some(data, param2 as Predicate, {
    ...param3,
    childrenKey: param1 as ChildrenKey,
  });
}

function some<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  predicate: (value: PartialDeep<Item>) => boolean,
  options?: FindOptions<ChildrenKey>,
): boolean {
  if (!data?.length) return false;

  const childrenKey = options?.childrenKey ?? 'children';
  const cache = options?.cache ?? new WeakMap<Item, boolean>();
  const nestedArray = options?.nestedArray ?? false;

  for (const item of data) {
    if (Array.isArray(item)) {
      if (!nestedArray) continue;

      return some(item, predicate, {
        childrenKey,
        cache,
        nestedArray,
      });
    }

    if (isObject(item)) {
      if (cache.has(item))
        continue;

      cache.set(item, true);

      if (predicate(item))
        return true;

      const children = item[childrenKey as keyof typeof item];

      if (Array.isArray(children) && children.length) {
        const result = some(children, predicate, {
          childrenKey,
          cache,
          nestedArray,
        });

        if (result)
          return true;
      }
    }
  }

  return false;
}
