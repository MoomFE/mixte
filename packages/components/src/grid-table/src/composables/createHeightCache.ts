import type { TreeNode } from 'treemate';

interface HeightCacheOptions {
  /** 数据 ( 行数据列表 ) */
  getData: () => TreeNode<any>[] | undefined;
  /** 预估行高 */
  getEstimated: () => number;
  /** 固定行高 */
  getFixed: () => number | null;
}

interface HeightCache {
  /**
   * 更新行高度
   * - 固定行高模式下忽略更新 ( 不写入缓存 )
   * - index 必须为 rowObj 当前所在位置, 作为增量重建的起始脏索引
   * - 返回是否实际更新 ( 高度写入缓存 )
   */
  updateHeight: (index: number, rowObj: object, height: number) => boolean;
  /** 获取累计高度数组 ( 增量重建 ) */
  getHeights: () => number[];
  /**
   * 根据高度定位行索引
   * - 传入高度数组时直接在该数组上二分查找 ( 避免内部再次读取/重建缓存 )
   * - 未传入时基于缓存重建后的累计高度数组查找
   */
  findIndexByHeight: (height: number, heights?: number[]) => number;
}

/**
 * 累计高度缓存
 * - 纯逻辑模块, 不依赖 Vue 响应式
 * - 响应式数据通过 getter 传入
 * - 高度变更时由外部 ( 调用方 ) 触发重算信号
 */
function createHeightCache(options: HeightCacheOptions): HeightCache {
  const { getData, getEstimated, getFixed } = options;

  /** 已测量行高度集合, key 为行对象本身 */
  const measuredRowHeights = new WeakMap<object, number>();

  /** 缓存累计高度数组 */
  let cumulativeHeightsCache: number[] = [0];
  /** 最小脏索引 */
  let minDirtyIndex: number | undefined;
  /** 上次的数据引用 ( 用于检测行结构变化 ) */
  const lastData = { value: undefined as TreeNode<any>[] | undefined };
  /** 上次的固定行高 ( 用于检测固定行高切换 ) */
  const lastFixed = { value: undefined as number | null | undefined };
  /** 上次的预估行高 ( 用于检测预估行高变化 ) */
  const lastEstimated = { value: undefined as number | undefined };

  /**
   * 输入值变化时记录新值并强制全量重建
   * - last 为对应输入的上次记录值 ( 以对象包裹, 便于原地更新 )
   */
  function invalidateIfChanged<T>(last: { value: T | undefined }, value: T) {
    if (value !== last.value) {
      last.value = value;
      minDirtyIndex = 0;
    }
  }

  /** 更新行高度 */
  function updateHeight(index: number, rowObj: object, height: number): boolean {
    // 固定行高下忽略更新
    if (getFixed() != null) return false;

    if (measuredRowHeights.get(rowObj) !== height) {
      measuredRowHeights.set(rowObj, height);

      if (minDirtyIndex === undefined || index < minDirtyIndex) {
        minDirtyIndex = index;
      }

      return true;
    }

    return false;
  }

  /** 增量更新累计高度数组 */
  function getHeights(): number[] {
    const data = getData();
    const dataLength = data?.length ?? 0;
    const fixed = getFixed();

    // 行结构变化时, 强制全量重建 ( 数据引用变化意味着行顺序或数量可能已改变 )
    invalidateIfChanged(lastData, data);

    // 固定行高变化时, 强制全量重建
    invalidateIfChanged(lastFixed, fixed);

    let heights: number[];

    if (fixed != null) {
      heights = Array.from({ length: dataLength + 1 }, (_, i) => i * fixed);
    }
    else {
      const estimated = getEstimated();

      // 预估行高变化时, 强制全量重建
      invalidateIfChanged(lastEstimated, estimated);

      const prevLength = cumulativeHeightsCache.length;
      const dirtyMin = minDirtyIndex ?? dataLength;
      const start = Math.min(prevLength - 1, dirtyMin);

      // 先裁剪到 start 之前
      heights = cumulativeHeightsCache.slice(0, start + 1);

      let prev = heights[start] ?? 0;
      for (let i = start + 1; i <= dataLength; i++) {
        const rowObj = data?.[i - 1]?.rawNode;
        const cachedHeight = rowObj ? measuredRowHeights.get(rowObj) : undefined;
        const rowHeight = cachedHeight != null ? cachedHeight : estimated;
        prev = prev + rowHeight;
        heights[i] = prev;
      }

      // 如果数据变短, 裁剪
      if (heights.length > dataLength + 1) {
        heights.length = dataLength + 1;
      }
    }

    minDirtyIndex = undefined;
    cumulativeHeightsCache = heights;

    return heights;
  }

  /** 根据高度在累计高度数组上二分定位行索引 */
  function binarySearchRowIndex(targetHeight: number, heights: number[]): number {
    let left = 0;
    let right = heights.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (heights[mid] < targetHeight) left = mid + 1;
      else right = mid;
    }

    return Math.max(0, left - 1);
  }

  /** 根据高度定位行索引 */
  function findIndexByHeight(targetHeight: number, heights?: number[]): number {
    return binarySearchRowIndex(targetHeight, heights ?? getHeights());
  }

  return {
    updateHeight,
    getHeights,
    findIndexByHeight,
  };
}

export { createHeightCache };
export type { HeightCache, HeightCacheOptions };
