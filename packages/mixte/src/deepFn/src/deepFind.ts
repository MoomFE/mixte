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
 * ];
 *
 * deepFind(data, item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'children', item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'items', item => item.id === 8); // -> { id: 8 }
 */
export function deepFind<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  predicate: (value: Item) => boolean,
): Item | undefined;

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
 * ];
 *
 * deepFind(data, item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'children', item => item.id === 5); // -> { id: 5 }
 * deepFind(data, 'items', item => item.id === 8); // -> { id: 8 }
 */
export function deepFind<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  childrenKey: ChildrenKey,
  predicate: (value: Item) => boolean,
): Item | undefined;

export function deepFind<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  Predicate extends (value: Item) => boolean,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  param1: ChildrenKey | Predicate,
  param2?: Predicate,
): Item | undefined {
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
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  predicate: (value: Item) => boolean,
  options?: FindOptions<ChildrenKey>,
): Item | undefined {
  if (!data?.length) return;

  const childrenKey = options?.childrenKey ?? 'children';
  const cache = options?.cache ?? new WeakMap<Item, boolean>();

  for (const item of data) {
    if (cache.has(item))
      continue;

    cache.set(item, true);

    if (predicate(item))
      return item;

    if (Array.isArray(item[childrenKey]) && item[childrenKey].length) {
      const result = find(item[childrenKey], predicate, {
        childrenKey,
        cache,
      });

      if (result)
        return result;
    }
  }
}
