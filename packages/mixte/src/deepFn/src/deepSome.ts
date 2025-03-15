import type { FindOptions } from './deepFind';

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
 *   {
 *     id: 1
 *   },
 *   {
 *     id: 2,
 *     children: [
 *       { id: 3 },
 *       { id: 4, children: [{ id: 5 }] }
 *     ],
 *     items: [
 *      { id: 6 },
 *      { id: 7, items: [{ id: 8 }] }
 *     ]
 *   }
 * ];
 *
 * deepSome(data, item => item.id === 5); // -> true
 * deepSome(data, 'children', item => item.id === 5); // -> true
 * deepSome(data, 'items', item => item.id === 8); // -> true
 * deepSome(data, item => item.id === 10); // -> false
 */
export function deepSome<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  predicate: (value: Item) => boolean,
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
 *   {
 *     id: 1
 *   },
 *   {
 *     id: 2,
 *     children: [
 *       { id: 3 },
 *       { id: 4, children: [{ id: 5 }] }
 *     ],
 *     items: [
 *      { id: 6 },
 *      { id: 7, items: [{ id: 8 }] }
 *     ]
 *   }
 * ];
 *
 * deepSome(data, item => item.id === 5); // -> true
 * deepSome(data, 'children', item => item.id === 5); // -> true
 * deepSome(data, 'items', item => item.id === 8); // -> true
 * deepSome(data, item => item.id === 10); // -> false
 */
export function deepSome<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  childrenKey: ChildrenKey,
  predicate: (value: Item) => boolean,
): boolean;

export function deepSome<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  Predicate extends (value: Item) => boolean,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  param1: ChildrenKey | Predicate,
  param2?: Predicate,
): boolean {
  if (!param2) {
    return some(data, param1 as Predicate);
  }

  return some(data, param2, {
    childrenKey: param1 as ChildrenKey,
  });
}

function some<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  predicate: (value: Item) => boolean,
  options?: FindOptions<ChildrenKey>,
): boolean {
  if (!data?.length) return false;

  const childrenKey = options?.childrenKey ?? 'children';
  const cache = options?.cache ?? new WeakMap<Item, boolean>();

  for (const item of data) {
    if (cache.has(item))
      continue;

    cache.set(item, true);

    if (predicate(item))
      return true;

    if (Array.isArray(item[childrenKey]) && item[childrenKey].length) {
      const result = some(item[childrenKey], predicate, {
        childrenKey,
        cache,
      });

      if (result)
        return true;
    }
  }

  return false;
}
