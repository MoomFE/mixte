import type { MaybeRefOrGetter } from 'vue';

export interface GridTableProps<
  Fields extends Record<string, any>,
  Item = Fields & Record<string, any>,
> {
  /**
   * 表格行主键
   * @default 'id'
   */
  rowKey?: MaybeRefOrGetter<string>;

  /** 数据源 */
  data?: Item[];
  /** 表格列配置 */
  columns?: GridTableColumn<Fields>[];

  /** 加载中 */
  loading?: boolean;

  /**
   * 是否启用虚拟列表
   *   - 需要为表格设置一个高度
   */
  virtual?: boolean;
  /**
   * 启用虚拟列表时预渲染的行数
   *   - 可减少快速滚动时的白屏
   * @default 5
   */
  overscan?: number;
  /**
   * 启用虚拟列表时的预估行高度
   * @default 50
   */
  estimatedRowHeight?: MaybeRefOrGetter<number>;
}

export interface RenderProps<
  Fields extends Record<string, any>,
  Item = Fields & Record<string, any>,
> {
  value: any;
  record: Item;
  column: GridTableColumn<Fields>;
  index: number;
}

export interface GridTableColumn<
  Fields extends Record<string, any>,
> {
  /** 字段名 */
  field: keyof Fields | (string & {});
  /** 表头名称 */
  title?: string;

  /** 表头自定义渲染方法 */
  headerRender?: (props: {
    column: GridTableColumn<Fields>;
  }) => any;

  /** 单元格自定义渲染方法 */
  render?: (props: RenderProps<Fields>) => any;

  /** 列宽度 */
  width?: string | number;

  /**
   * 列的对齐方式
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';

  /** 列固定 */
  fixed?: boolean | 'left' | 'right';
}

export type GridTableSlots<
  Fields extends Record<string, any>,
> = GridTableFieldsSlots<Fields> & GridTableHeaderSlots<Fields>;

/** 字段单元格插槽 */
export type GridTableFieldsSlots<
  Fields extends Record<string, any>,
  Keys extends string = Extract<keyof Fields, string>,
> = {
  /** 通用字段单元格插槽 */
  cell?: (props: RenderProps<Fields>) => any;
} & {
  /** 指定字段单元格插槽 */
  [K in Keys as `cell-${K}`]?: (props: RenderProps<Fields>) => any;
};

/** 表头单元格插槽 */
export type GridTableHeaderSlots<
  Fields extends Record<string, any>,
  Keys extends string = Extract<keyof Fields, string>,
> = {
  /** 通用表头单元格插槽 */
  header?: (props: {
    column: GridTableColumn<Fields>;
  }) => any;
} & {
  /** 指定字段表头单元格插槽 */
  [K in Keys as `header-${K}`]?: (props: {
    column: GridTableColumn<Fields>;
  }) => any;
};
