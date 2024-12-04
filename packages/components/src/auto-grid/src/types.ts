export interface AutoGridProps<T extends any[] | number | undefined = undefined> {
  /**
   * 组件宽度 (单位: px)
   *  - 正常情况无需使用, 会自动获取组件宽度
   */
  width?: number | `${number}`;
  /** 列表数据 */
  list?: T;
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

export interface AutoGridSlots<T extends any[] | number | undefined = undefined> {
  overflowSuffix?: () => any;
  default?: T extends undefined
    ? () => any
    : (props: {
        item: T extends any[] ? T[number] : number;
        index: number;
      }) => any;
}
