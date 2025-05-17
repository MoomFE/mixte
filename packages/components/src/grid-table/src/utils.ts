import type { GridTableColumn } from '@mixte/components/grid-table/types';

/**
 * 定义表格列
 */
export function defineTableColumns<Fields extends Record<string, any>>(columns: GridTableColumn<Fields>[]) {
  return columns;
}
