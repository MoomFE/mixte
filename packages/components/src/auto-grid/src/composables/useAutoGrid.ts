import type { CSSProperties } from 'vue';
import type { AutoGridProps } from '../types';
import { useElementSize } from '@vueuse/core';
import { isNumeric } from 'mixte';
import { computed, ref } from 'vue';

export function useAutoGrid<T extends any[] | number | undefined>(props: AutoGridProps<T>) {
  const rootRef = ref<HTMLElement>();
  const rootWidth = useElementSize(rootRef).width;

  const isCustomWidth = computed(() => isNumeric(props.width));
  const width = computed(() => isCustomWidth.value ? +props.width! : rootWidth.value);

  const itemWidth = computed(() => isNumeric(props.itemWidth) ? +props.itemWidth : width.value);
  const gap = computed(() => isNumeric(props.gap) ? +props.gap : 0);
  const gapX = computed(() => isNumeric(props.gapX) ? +props.gapX : gap.value);
  const gapY = computed(() => isNumeric(props.gapY) ? +props.gapY : gap.value);

  const collapsedRows = computed(() => isNumeric(props.collapsedRows) ? Math.max(1, +props.collapsedRows) : 1);

  /** 每行可以渲染的子元素数量 */
  const columnCount = computed(() => {
    return Math.floor((width.value + gapX.value) / (itemWidth.value + gapX.value)) || 1;
  });

  const rootStyle = computed<CSSProperties>(() => ({
    width: isCustomWidth.value ? `${props.width}px` : '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columnCount.value}, 1fr)`,
    columnGap: `${gapX.value}px`,
    rowGap: `${gapY.value}px`,
  }));

  return {
    rootRef,

    collapsedRows,
    columnCount,

    rootStyle,
  };
}
