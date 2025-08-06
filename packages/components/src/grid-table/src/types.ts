import type { MaybeRefOrGetter } from 'vue';

// #region GridTableProps

export interface GridTableProps<Fields extends Record<string, any>> {
  /**
   * 表格行主键
   * @default 'id'
   */
  rowKey?: MaybeRefOrGetter<string>;

  /** 数据源 */
  data?: any[];
  /** 表格列配置 */
  columns?: GridTableColumn<Fields>[];

  /** 是否加载中 */
  loading?: boolean;

  /**
   * 是否启用虚拟列表
   *  - 需要为表格设置一个高度
   */
  virtual?: boolean;
  /**
   * 启用虚拟列表时预渲染的行数
   *  - 可减少快速滚动时的白屏
   * @default 5
   */
  overscan?: number | `${number}`;
  /**
   * 启用虚拟列表时的预估行高度
   * @default 50
   */
  estimatedRowHeight?: number | `${number}`;

  /**
   * 树形数据子节点字段名
   * @default 'children'
   */
  childrenKey?: keyof Fields | 'children' | (string & {});
  /**
   * 显示展开按钮的列主键
   *  - 如果不设置, 则使用第一列作为展开列
   */
  expandColumnKey?: keyof Fields | (string & {});
  /**
   * 树形数据展开的行主键列表
   *  - 支持通过 v-model:expandedRowKeys="xxx" 进行双向绑定
   */
  expandedRowKeys?: string[];
  /**
   * 展示树形数据时, 每层缩进的宽度, 以 px 为单位
   * @default 15
   */
  expandedIndent?: number | `${number}`;

  /** 单元格样式类 ( th/td ) */
  cellClass?: string;
  /** 表头单元格样式类 ( th ) */
  headerCellClass?: string;
  /** 表体单元格样式类 ( td ) */
  contentCellClass?: string;
}

// #endregion GridTableProps
// #region GridTableColumn

export interface GridTableColumn<
  Fields extends Record<string, any>,
  Item extends Record<string, any> = Fields & Record<string, any>,
> {
  /** 字段名 */
  field: keyof Fields | (string & {});
  /** 表头名称 */
  title?: string | ((props: ColumnProps<Item>) => string);

  /** 表头自定义渲染方法 */
  headerRender?: (props: ColumnProps<Item>) => any;

  /** 单元格自定义渲染方法 */
  render?: (props: RenderProps<Item>) => any;

  /** 列宽度 */
  width?: string | number | `${number}` | ((props: ColumnProps<Item>) => string | number | `${number}`);

  /**
   * 列的对齐方式
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';

  /** 列固定 */
  fixed?: boolean | 'left' | 'right';

  /** 单元格样式类 ( th/td ) */
  cellClass?: string;
  /** 表头单元格样式类 ( th ) */
  headerCellClass?: string;
  /** 表体单元格样式类 ( td ) */
  contentCellClass?: string;

  /** 显示列 */
  visible?: boolean | ((props: ColumnProps<Item>) => boolean);
  /** 隐藏列 */
  hidden?: boolean | ((props: ColumnProps<Item>) => boolean);
}

export interface ColumnProps<Fields extends Record<string, any>> {
  column: GridTableColumn<Fields>;
}

export interface RenderProps<Fields extends Record<string, any>> {
  value: any;
  record: Fields;
  column: GridTableColumn<Fields>;
  index: number;
}

// #endregion GridTableColumn

export interface GridTableExpose {
  /** 展开所有行 */
  expandAllRows: () => void;
  /** 折叠所有行 */
  collapseAllRows: () => void;
  /** 展开指定行 */
  expandRows: (keys: string[]) => void;
  /** 折叠指定行 */
  collapseRows: (keys: string[]) => void;
}

export type GridTableSlots<
  Fields extends Record<string, any>,
> = GridTableFieldsSlots<Fields> & GridTableHeaderSlots<Fields>;

/** 字段单元格插槽 */
export type GridTableFieldsSlots<
  Fields extends Record<string, any>,
  Item extends Record<string, any> = Fields & Record<string, any>,
> = {
  /** 通用字段单元格插槽 */
  cell?: (props: RenderProps<Item>) => any;
} & {
  /** 指定字段单元格插槽 */
  [K in Extract<keyof Fields, string> as `cell-${K}`]?: (props: RenderProps<Item>) => any;
} & {
  /** 其他字段单元格插槽 */
  [K in string as `cell-${K}`]?: (props: RenderProps<Item>) => any;
};

/** 表头单元格插槽 */
export type GridTableHeaderSlots<Fields extends Record<string, any>> = {
  /** 通用表头单元格插槽 */
  header?: (props: { column: GridTableColumn<Fields> }) => any;
} & {
  /** 指定字段表头单元格插槽 */
  [K in Extract<keyof Fields, string> as `header-${K}`]?: (props: { column: GridTableColumn<Fields> }) => any;
} & {
  /** 其他字段表头单元格插槽 */
  [K in string as `header-${K}`]?: (props: { column: GridTableColumn<Fields> }) => any;
};
