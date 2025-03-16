import type { FindOptions } from './deepFind';

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
 * deepForEach(data, item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'children', item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'items', item => console.log(item.id)); // -> 6, 7, 8
 */
export function deepForEach<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  callback: (value: Item) => void,
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
 * deepForEach(data, item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'children', item => console.log(item.id)); // -> 1, 2, 3, 4, 5
 * deepForEach(data, 'items', item => console.log(item.id)); // -> 6, 7, 8
 */
export function deepForEach<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  childrenKey: ChildrenKey,
  callback: (value: Item) => void,
): void;

export function deepForEach<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  Callback extends (value: Item) => void,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  param1: ChildrenKey | Callback,
  param2?: Callback,
): void {
  if (!param2) {
    forEach(data, param1 as Callback);
  }
  else {
    forEach(data, param2, {
      childrenKey: param1 as ChildrenKey,
    });
  }
}

function forEach<
  Item extends {
    [key in ChildrenKey]?: Item[] | any
  } & Record<string, any>,
  ChildrenKey extends string = 'children',
>(
  data: Item[] | undefined,
  callback: (value: Item) => void,
  options?: FindOptions<ChildrenKey>,
): void {
  if (!data?.length) return;

  const childrenKey = options?.childrenKey ?? 'children';
  const cache = options?.cache ?? new WeakMap<Item, boolean>();

  for (const item of data) {
    if (cache.has(item))
      continue;

    cache.set(item, true);

    callback(item);

    if (Array.isArray(item[childrenKey]) && item[childrenKey].length) {
      forEach(item[childrenKey], callback, {
        childrenKey,
        cache,
      });
    }
  }
}
