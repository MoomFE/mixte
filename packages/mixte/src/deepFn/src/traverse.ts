import type { PartialDeep } from 'type-fest';
import type { DeepArray, FindOptions } from './deepFind';
import { isObject } from 'mixte';

/**
 * 深度遍历嵌套数据结构, 按发现顺序对每个对象元素执行 visitor
 *  - visitor 返回 `true` 时立即结束遍历
 *  - 通过 `nestedArray` 选项支持嵌套数组结构
 *  - 使用 cache 记录已访问的元素与嵌套数组, 避免循环引用导致的无限递归与重复遍历
 *
 * @returns 是否因 visitor 返回 `true` 而提前结束
 */
export function traverse<Item extends Record<string, any>>(
  data: DeepArray<PartialDeep<Item>> | undefined,
  options: FindOptions<string> = {},
  visitor: (value: PartialDeep<Item>) => boolean | void,
): boolean {
  if (!data?.length) return false;

  const childrenKey = options.childrenKey ?? 'children';
  const cache = options.cache ?? new WeakMap<any, boolean>();
  const nestedArray = options.nestedArray ?? false;

  for (const item of data) {
    // 嵌套数组: 启用 nestedArray 后向下遍历, 并记录访问状态, 防止循环引用
    if (Array.isArray(item)) {
      if (!nestedArray) continue;
      if (cache.has(item)) continue;

      cache.set(item, true);

      if (traverse(item, { childrenKey, cache, nestedArray }, visitor))
        return true;

      continue;
    }

    // 原始值: 跳过
    if (!isObject(item)) continue;

    // 已访问过的元素: 跳过, 防止循环引用
    if (cache.has(item)) continue;

    cache.set(item, true);

    if (visitor(item as PartialDeep<Item>))
      return true;

    const children = item[childrenKey as unknown as keyof typeof item];

    if (Array.isArray(children) && children.length && traverse(children, { childrenKey, cache, nestedArray }, visitor)) {
      return true;
    }
  }

  return false;
}
