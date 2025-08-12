import type { RenderProps } from '@mixte/components/grid-table/types';
import { wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState } from '@vueuse/core';
import { isNumeric } from 'mixte';
import { ref, watchEffect } from 'vue';
import { useShared } from './useShared';
import { useTreeData } from './useTreeData';

interface CellSpanMeta {
  rowSpan: number;
  colSpan: number;
  skip: boolean;
}

export const [
  useSpanStore,
  useSpan,
] = createInjectionState(() => {
  const { props, columns } = useShared()!;
  const { displayedData } = useTreeData()!;

  const matrix = ref<CellSpanMeta[][]>([]);

  wheneverEffectScopeImmediate(() => {
    return !props.virtual && columns.value?.some(col => col.colSpan || col.rowSpan) && !!displayedData.value.length;
  }, (_, __, onCleanup) => {
    onCleanup(() => {
      matrix.value = [];
    });

    watchEffect(() => {
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

          // 标记合并的单元格
          if (colSpan > 1 || rowSpan > 1) {
            for (let dr = 0; dr < rowSpan; dr++) {
              for (let dc = 0; dc < colSpan; dc++) {
                if (dr === 0 && dc === 0) continue; // 跳过自身

                const rr = r + dr;
                const cc = c + dc;

                if (rr < rows && cc < cols) {
                  newMatrix[rr][cc].skip = true;
                }
              }
            }
          }
        }
      }

      matrix.value = newMatrix;
    });
  });

  return {
    spanMatrix: matrix,
  };
});
