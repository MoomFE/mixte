import { watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState, useCssVar } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useShared } from './useShared';

export const [
  useVirtualStore,
  useVirtual,
] = createInjectionState(() => {
  const {
    props,

    overscan,

    displayedData,

    tableWrapSize,
    tableWrapScroll,

    tableRef,

    tableTheadSize,
  } = useShared()!;

  const { cumulativeHeights, updateRowHeight, findIndexByHeight } = useCumulativeHeights();

  /** 表格展示区高度 */
  const tableBodyHeight = computed(() => {
    return tableWrapSize.height - tableTheadSize.height;
  });

  /** 可见行的起始索引 */
  const visibleStart = computed(() => {
    return Math.max(
      0,
      findIndexByHeight(tableWrapScroll.y) - overscan.value,
    );
  });

  /** 可见行的结束索引 */
  const visibleEnd = computed(() => {
    return Math.min(
      displayedData.value.length ?? 0,
      findIndexByHeight(tableWrapScroll.y + tableBodyHeight.value) + overscan.value,
    );
  });

  /** 可见行数据 */
  const data = computed(() => {
    if (!props.virtual) return;

    return displayedData.value.slice(visibleStart.value, visibleEnd.value) ?? [];
  });

  /** 表格高度 */
  const tableHeight = useCssVar('--mixte-gt-virtual-h', tableRef);
  const tableHeightWillChange = useCssVar('--mixte-gt-virtual-h-wc', tableRef);
  /** 表格顶部不可见区域高度 */
  const tableBodyPaddingTop = useCssVar('--mixte-gt-virtual-pt', tableRef);
  const tableBodyPaddingTopWillChange = useCssVar('--mixte-gt-virtual-pt-wc', tableRef);

  wheneverEffectScopeImmediate(() => props.virtual, (_, __, onCleanup) => {
    watchImmediate(() => cumulativeHeights.value[cumulativeHeights.value.length - 1], (totalHeight) => {
      tableHeight.value = `${totalHeight}px`;
    });

    watchImmediate(visibleStart, (start) => {
      tableBodyPaddingTop.value = `${cumulativeHeights.value[start] || 0}px`;
    });

    watch(() => tableWrapScroll.isScrolling, (isScrolling) => {
      tableHeightWillChange.value = isScrolling ? 'height' : undefined;
      tableBodyPaddingTopWillChange.value = isScrolling ? 'padding-top' : undefined;
    }, {
      flush: 'sync',
    });

    onCleanup(() => {
      tableHeight.value = undefined;
      tableBodyPaddingTop.value = undefined;
      tableHeightWillChange.value = undefined;
      tableBodyPaddingTopWillChange.value = undefined;
    });
  });

  return {
    visibleStart,

    data,

    updateRowHeight,
  };
});

function useCumulativeHeights() {
  const { estimatedRowHeight, displayedData } = useShared()!;

  /** 实际行高度集合, key 为行对象本身 */
  const realRowsHeight = new WeakMap<object, number>();

  /** 缓存累计高度数组 */
  let cumulativeHeightsCache: number[] = [0];
  /** 记录被修改的行 index 集合 */
  const dirtyIndexes = ref<Set<number>>(new Set());

  /** 更新行高度, index + row */
  function updateRowHeight(index: number, rowObj: object, height: number) {
    if (realRowsHeight.get(rowObj) !== height) {
      realRowsHeight.set(rowObj, height);
      dirtyIndexes.value.add(index);
    }
  }

  /** 增量更新累计高度数组 */
  const cumulativeHeights = computed(() => {
    const estimated = estimatedRowHeight.value;
    const data = displayedData.value;
    const dataLength = data.length ?? 0;
    const prevLength = cumulativeHeightsCache.length;
    const dirtyMin = dirtyIndexes.value.size > 0 ? Math.min(...dirtyIndexes.value) : dataLength;
    const start = Math.min(prevLength - 1, dirtyMin);

    // 先裁剪到 start 之前
    const heights = cumulativeHeightsCache.slice(0, start + 1);

    let prev = heights[start] ?? 0;
    for (let i = start + 1; i <= dataLength; i++) {
      const rowObj = data[i - 1]?.rawNode;
      const cachedHeight = rowObj ? realRowsHeight.get(rowObj) : undefined;
      const rowHeight = cachedHeight != null ? cachedHeight : estimated;
      prev = prev + rowHeight;
      heights[i] = prev;
    }

    // 如果数据变短, 裁剪
    if (heights.length > dataLength + 1) {
      heights.length = dataLength + 1;
    }

    dirtyIndexes.value.clear();
    cumulativeHeightsCache = heights;

    return heights;
  });

  /** 使用二分查找定位索引 */
  function findIndexByHeight(targetHeight: number) {
    const heights = cumulativeHeights.value;
    let left = 0;
    let right = heights.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (heights[mid] < targetHeight) left = mid + 1;
      else right = mid;
    }

    return Math.max(0, left - 1);
  }

  return {
    cumulativeHeights,

    updateRowHeight,
    findIndexByHeight,
  };
}
