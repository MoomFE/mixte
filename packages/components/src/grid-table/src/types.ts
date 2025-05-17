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
}

export interface GridTableColumn<Fields extends Record<string, any>> {
  /** 字段名 */
  field: keyof Fields | (string & {});
  /** 表头名称 */
  title?: string;
}
