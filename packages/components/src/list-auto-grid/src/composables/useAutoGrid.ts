import type { CSSProperties } from 'vue-demi';
import { computed, ref } from 'vue-demi';
import { useElementSize } from '@vueuse/core';
import { isNumeric } from 'mixte';

export interface CommomAutoGridProps {
  /**
   * 组件宽度 (单位: px)
   *  - 正常情况无需使用, 会自动获取组件宽度
   */
  width?: number | `${number}`;
  /** 子元素最小宽度 (单位: px) */
  itemWidth?: number | `${number}`;
  /** 横纵间距 (单位: px) */
  gap?: number | `${number}`;
  /** 横向间距 (单位: px) */
  gapX?: number | `${number}`;
  /** 纵向间距 (单位: px) */
  gapY?: number | `${number}`;
  /** 是否折叠 */
  collapsed?: boolean;
  /** 显示行数 */
  collapsedRows?: number | `${number}`;
  /** 只有一行时, 平铺所有子元素 */
  fluid?: boolean;
}

export function useAutoGrid(props: CommomAutoGridProps) {
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
