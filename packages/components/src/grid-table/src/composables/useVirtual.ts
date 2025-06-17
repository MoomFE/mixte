import { watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState, useCssVar } from '@vueuse/core';
import { isNumeric } from 'mixte';
import { computed, ref } from 'vue';
import { useShared } from './useShared';

export const [
  useVirtualStore,
  useVirtual,
] = createInjectionState(() => {
  const {
    props,

    tableWrapSize,
    tableWrapScroll,

    tableRef,

    tableTheadSize,
  } = useShared()!;

  /** 预估行高度 */
  const estimatedRowHeight = computed(() => isNumeric(props.estimatedRowHeight) ? props.estimatedRowHeight : 50);
  /** 预渲染的行数 */
  const overscan = computed(() => isNumeric(props.overscan) && props.overscan >= 0 ? props.overscan : 5);

  /** 实际行高度 */
  const realRowsHeight = ref<Record<number, number>>({});

  /** 表格展示区高度 */
  const tableBodyHeight = computed(() => {
    return tableWrapSize.height - tableTheadSize.height;
  });

  /** 累积高度数组，用于动态行高计算 */
  const cumulativeHeights = computed(() => {
    const dataLength = props.data?.length ?? 0;
    const heights: number[] = Array.from({ length: dataLength + 1 });

    heights[0] = 0;

    for (let i = 0; i < dataLength; i++) {
      const realHeight = realRowsHeight.value[i];
      const height = realHeight ?? estimatedRowHeight.value;
      heights[i + 1] = heights[i] + height;
    }

    return heights;
  });

  /** 使用二分查找定位索引 */
  const findIndexByHeight = (targetHeight: number) => {
    const heights = cumulativeHeights.value;
    let left = 0;
    let right = heights.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (heights[mid] < targetHeight) left = mid + 1;
      else right = mid;
    }

    return Math.max(0, left - 1);
  };

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
      props.data?.length ?? 0,
      findIndexByHeight(tableWrapScroll.y + tableBodyHeight.value) + overscan.value,
    );
  });

  /** 可见行数据 */
  const data = computed(() => {
    if (!props.virtual) return props.data ?? [];

    return props.data?.slice(visibleStart.value, visibleEnd.value) ?? [];
  });

  /** 表格高度 */
  const tableHeight = useCssVar('--mixte-gt-virtual-height', tableRef);
  /** 表格顶部不可见区域高度 */
  const tableBodyPaddingTop = useCssVar('--mixte-gt-virtual-padding-top', tableRef);

  wheneverEffectScopeImmediate(() => props.virtual, (_, __, onCleanup) => {
    watchImmediate(() => cumulativeHeights.value[cumulativeHeights.value.length - 1], (totalHeight) => {
      tableHeight.value = `${totalHeight}px`;
    });

    watchImmediate(visibleStart, (start) => {
      tableBodyPaddingTop.value = `${cumulativeHeights.value[start] || 0}px`;
    });

    onCleanup(() => {
      tableHeight.value = undefined;
      tableBodyPaddingTop.value = undefined;
    });
  });

  return {
    visibleStart,

    data,

    realRowsHeight,
  };
});
