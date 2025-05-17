import type { GridTableColumn } from '@mixte/components/grid-table/types';

/**
 * 定义表格列
 */
export function defineTableColumns<Fields extends Record<string, any>>(columns: GridTableColumn<Fields>[]) {
  return columns;
}

/** 判断列是否是固定在左侧的列 */
export function columnIsFixedLeft(column: GridTableColumn<Record<string, any>>) {
  return column.fixed === true || column.fixed === 'left';
}
/** 判断列是否是固定在右侧的列 */
export function columnIsFixedRight(column: GridTableColumn<Record<string, any>>) {
  return column.fixed === 'right';
}
