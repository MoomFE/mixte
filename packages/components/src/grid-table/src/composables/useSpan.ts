import type { RenderProps } from '@mixte/components/grid-table/types';
import type { TreeNode } from 'treemate';
import { wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState } from '@vueuse/core';
import { isNumeric } from 'mixte';
import { ref, watchEffect } from 'vue';
import { useShared } from './useShared';
import { useTreeData } from './useTreeData';

interface CellSpanMeta {
  /** 行合并数 */
  rowSpan: number;
  /** 列合并数 */
  colSpan: number;
  /** 是否跳过渲染 ( 被行列合并 ) */
  skip: boolean;
  /** 被行合并覆盖时, 指向的起始列索引 ( 仅虚拟列表下启用 ) */
  mergedRowSpanFrom?: number;
}

export const [
  useSpanStore,
  useSpan,
] = createInjectionState(() => {
  const { props, columns } = useShared()!;
  const { displayedData } = useTreeData()!;

  const matrix = ref<CellSpanMeta[][]>([]);

  /** 是否有启用了行合并的表格列 */
  const hasRowSpan = computed(() => columns.value?.some(col => col.rowSpan));
  /** 是否有启用了行/列合并的表格列 */
  const hasSpan = computed(() => columns.value?.some(col => col.rowSpan || col.colSpan));

  /**
   * 启用了列合并的列左侧的单元格数量
   *  - 用于在启用虚拟表格时, 计算列偏移
   */
  const spanColLeftCount = computed(() => {
    let lastColIndex: number | undefined;

    return columns.value?.map((col, colIndex) => {
      if (!col.colSpan) return -1;

      if (lastColIndex == null) return (lastColIndex = colIndex);

      const leftCount = colIndex - lastColIndex - 1;

      lastColIndex = colIndex;

      return leftCount;
    });
  });

  wheneverEffectScopeImmediate(() => hasSpan.value && !!displayedData.value.length, (_, __, onCleanup) => {
    onCleanup(() => {
      matrix.value = [];
    });

    watchEffect(() => {
      const virtual = props.virtual;

      const rows = displayedData.value.length;
      const cols = columns.value!.length;

      const newMatrix: CellSpanMeta[][] = Array.from({ length: rows }, () => {
        return Array.from({ length: cols }, () => ({ rowSpan: 1, colSpan: 1, skip: false }));
      });

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const meta = newMatrix[r][c];

          if (meta.skip) continue;

          const record = displayedData.value[r].rawNode;
          const column = columns.value![c];

          const fnProps: Omit<RenderProps<any>, 'value'> = { column, record, index: r };

          const colSpanRaw = column.colSpan?.(fnProps);
          const rowSpanRaw = column.rowSpan?.(fnProps);

          let colSpan = isNumeric(colSpanRaw) ? Number(colSpanRaw) : 1;
          let rowSpan = isNumeric(rowSpanRaw) ? Number(rowSpanRaw) : 1;

          // 边界裁剪: 不可超过剩余行/列
          if (c + colSpan > cols) colSpan = Math.max(1, cols - c);
          if (r + rowSpan > rows) rowSpan = Math.max(1, rows - r);

          meta.colSpan = colSpan;
          meta.rowSpan = rowSpan;

          const isRowSpan = rowSpan > 1;

          // 标记合并的单元格
          if (isRowSpan || colSpan > 1) {
            for (let dr = 0; dr < rowSpan; dr++) {
              for (let dc = 0; dc < colSpan; dc++) {
                if (dr === 0 && dc === 0) continue; // 跳过自身

                const rr = r + dr;
                const cc = c + dc;

                if (rr < rows && cc < cols) {
                  const cellMeta = newMatrix[rr][cc];

                  cellMeta.skip = true;

                  if (virtual && isRowSpan)
                    cellMeta.mergedRowSpanFrom = r;
                }
              }
            }
          }
        }
      }

      matrix.value = newMatrix;
    });
  });

  /** 获取可见行数据的列合并起始索引 ( 仅虚拟列表下启用 ) */
  function getVisibleDataColSpanStart(
    visibleStart: number,
    data: TreeNode[] | undefined,
  ) {
    if (!hasRowSpan.value || !data?.length) return visibleStart;

    let startIndex = -1;

    for (let columnIndex = 0; columnIndex < columns.value!.length; columnIndex++) {
      const column = columns.value![columnIndex];

      if (column.rowSpan) {
        const mergedRowSpanFrom = matrix.value[visibleStart]?.[columnIndex]?.mergedRowSpanFrom;

        if (mergedRowSpanFrom != null) {
          startIndex = Math.max(startIndex, mergedRowSpanFrom);
        }
      }
    }

    return startIndex === -1 ? visibleStart : startIndex;
  }

  return {
    spanMatrix: matrix,
    spanColLeftCount,

    getVisibleDataColSpanStart,
  };
});
