import type { PartialDeep, Primitive } from 'type-fest';
import { isObject } from 'mixte';

type DeepArray<T> = (T | DeepArray<T> | Primitive)[];

/**
 * 在嵌套数据结构中深度查找满足条件的第一个元素, 如果没有找到则返回 undefined
 *
 *
 * @see https://mixte.moomfe.com/mixte/deepFn#deepFind
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
 *   // 嵌套数组结构
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
 * deepFind(data, item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'children', item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'items', item => item.id === 8); // -> { id: 8 }
 * // 嵌套数组结构
 * deepFind(data, item => item.id === 9); // -> { id: 9 }
 * deepFind(data, 'children', item => item.id === 11); // -> { id: 11 }
 * deepFind(data, 'items', item => item.id === 12); // -> { id: 12 }
 */
export function deepFind<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  predicate: (value: PartialDeep<Item>) => boolean,
): PartialDeep<Item> | undefined;

/**
 * 在嵌套数据结构中深度查找满足条件的第一个元素, 如果没有找到则返回 undefined
 *
 *
 * @see https://mixte.moomfe.com/mixte/deepFn#deepFind
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
 *   // 嵌套数组结构
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
 * deepFind(data, item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'children', item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'items', item => item.id === 8); // -> { id: 8 }
 * // 嵌套数组结构
 * deepFind(data, item => item.id === 9); // -> { id: 9 }
 * deepFind(data, 'children', item => item.id === 11); // -> { id: 11 }
 * deepFind(data, 'items', item => item.id === 12); // -> { id: 12 }
 */
export function deepFind<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  childrenKey: ChildrenKey,
  predicate: (value: PartialDeep<Item>) => boolean,
): PartialDeep<Item> | undefined;

export function deepFind<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  Predicate extends (value: PartialDeep<Item>) => boolean,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  param1: ChildrenKey | Predicate,
  param2?: Predicate,
): PartialDeep<Item> | undefined {
  if (!param2) {
    return find(data, param1 as Predicate);
  }

  return find(data, param2, {
    childrenKey: param1 as ChildrenKey,
  });
}

export interface FindOptions<ChildrenKey extends string> {
  childrenKey?: ChildrenKey;
  cache?: WeakMap<any, boolean>;
}

function find<
  Item extends {
    [key in ChildrenKey]?: PartialDeep<Item>[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  predicate: (value: PartialDeep<Item>) => boolean,
  options?: FindOptions<ChildrenKey>,
): PartialDeep<Item> | undefined {
  if (!data?.length) return;

  const childrenKey = options?.childrenKey ?? 'children';
  const cache = options?.cache ?? new WeakMap<Item, boolean>();

  for (const item of data) {
    if (Array.isArray(item)) {
      const result = find(item, predicate, {
        childrenKey,
        cache,
      });

      if (result)
        return result;

      continue;
    }

    if (isObject(item)) {
      if (cache.has(item))
        continue;

      cache.set(item, true);

      if (predicate(item))
        return item;

      const children = item[childrenKey as keyof typeof item];

      if (Array.isArray(children) && children.length) {
        const result = find(children, predicate, {
          childrenKey,
          cache,
        });

        if (result)
          return result;
      }
    }
  }
}
