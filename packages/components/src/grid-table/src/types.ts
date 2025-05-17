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
  // virtual?: boolean;
  /**
   * 启用虚拟列表时的预估行高度
   * @default 50
   */
  // estimatedRowHeight?: MaybeRefOrGetter<number>;
}

export interface GridTableColumn<
  Fields extends Record<string, any>,
  Item = Fields & Record<string, any>,
> {
  /** 字段名 */
  field: keyof Fields | (string & {});
  /** 表头名称 */
  title?: string;

  /** 自定义渲染方法 */
  render?: (props: {
    value: any;
    record: Item;
    column: GridTableColumn<Fields>;
    index: number;
  }) => any;

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
