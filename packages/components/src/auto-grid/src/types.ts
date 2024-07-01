import type { VNodeChild } from 'vue';

export interface AutoGridProps {
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
}

export interface AutoGridSlots {
  overflowSuffix?: () => VNodeChild;
  default?: () => VNodeChild[];
}
