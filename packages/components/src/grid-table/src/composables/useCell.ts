import type { GridTableColumn } from '@mixte/components/grid-table/types';
import type { StyleValue } from 'vue';
import { createNamedSharedComposable, watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState, syncRef, useCssVar, useElementBounding, useElementSize } from '@vueuse/core';
import { computed, ref } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '../utils';
import { useShared } from './useShared';
import { useTreeData } from './useTreeData';

export const [
  useCellStore,
  useCell,
] = createInjectionState(() => {
  const {
    props,

    childrenKey,
    expandColumnKey,

    fixedLeftColumns,
    fixedLeftColumnsRect,
    fixedRightColumns,
    fixedRightColumnsRect,

    tableWrapScroll,

    columnIndexMap,
  } = useShared()!;

  const { displayedData } = useTreeData()!;

  const createColumnStore = createNamedSharedComposable((column: GridTableColumn<Record<string, any>>) => {
    const columnIndex = computed(() => props.columns?.findIndex(({ field }) => field === column.field) ?? -1);
    const columnIsFirst = computed(() => columnIndex.value === 0);
    const columnIsLast = computed(() => columnIndex.value === (props.columns?.length ?? 0) - 1);

    const fixedLeft = computed(() => columnIsFixedLeft(column));
    const fixedLeftIndex = computed(() => fixedLeft.value ? fixedLeftColumns.value.findIndex(({ field }) => field === column.field) : -1);
    const fixedRight = computed(() => columnIsFixedRight(column));
    const fixedRightIndex = computed(() => fixedRight.value ? fixedRightColumns.value.findIndex(({ field }) => field === column.field) : -1);

    const zIndex = computed(() => {
      if (fixedLeft.value) return fixedLeftIndex.value + 2;
      if (fixedRight.value) return fixedRightIndex.value + 2;
    });

    syncRef(toRef(columnIndexMap.value, column.field), zIndex, {
      direction: 'rtl',
      transform: {
        rtl: val => val,
      },
    });

    const cellStyle = computed(() => {
      const style: StyleValue = {};

      if (fixedLeft.value) {
        if (fixedLeftIndex.value === 0) style.left = '0';
        else style.left = `calc(${Array.from({ length: fixedLeftIndex.value }).map((_, i) => `var(--mixte-gt-fix-left-column-${i}-width)`).join(' + ')})`;
      }
      else if (fixedRight.value) {
        if (fixedRightIndex.value === 0) style.right = '0';
        else style.right = `calc(${Array.from({ length: fixedRightIndex.value }).map((_, i) => `var(--mixte-gt-fix-right-column-${i}-width)`).join(' + ')})`;
      }

      return style;
    });

    const cellClasses = computed(() => {
      let classes = '';

      if (columnIsFirst.value) classes += 'mixte-gt-cell-first ';
      if (columnIsLast.value) classes += 'mixte-gt-cell-last ';

      if (fixedLeft.value) {
        const index = fixedLeftIndex.value;

        classes += 'mixte-gt-cell-fix mixte-gt-cell-fix-left ';

        if (tableWrapScroll.arrivedState.left === false) {
          const currentRect = fixedLeftColumnsRect.value[index];
          const prevRect = fixedLeftColumnsRect.value[index - 1];
          const nextRect = fixedLeftColumnsRect.value[index + 1];

          // 已固定
          if (index === 0) classes += 'mixte-gt-cell-fix-left-active ';
          else if (currentRect?.left <= prevRect?.right) classes += 'mixte-gt-cell-fix-left-active ';

          // 已固定列中, 当前列是最后一列
          if (classes.includes('mixte-gt-cell-fix-left-active') && (!nextRect || currentRect?.right < nextRect?.left))
            classes += 'mixte-gt-cell-fix-left-active-last ';
        }
      }
      else if (fixedRight.value) {
        const index = fixedRightIndex.value;

        classes += 'mixte-gt-cell-fix mixte-gt-cell-fix-right ';

        if (tableWrapScroll.arrivedState.right === false) {
          const currentRect = fixedRightColumnsRect.value[index];
          const prevRect = fixedRightColumnsRect.value[index - 1];
          const nextRect = fixedRightColumnsRect.value[index + 1];

          // 已固定
          if (index === 0) classes += 'mixte-gt-cell-fix-right-active ';
          else if (currentRect?.right >= prevRect?.left) classes += 'mixte-gt-cell-fix-right-active ';

          // 已固定列中, 当前列是最后一列
          if (classes.includes('mixte-gt-cell-fix-right-active') && (!nextRect || currentRect?.left > nextRect?.right))
            classes += 'mixte-gt-cell-fix-right-active-last ';
        }
      }

      if (column.align === 'center') classes += 'mixte-gt-cell-align-center ';
      else if (column.align === 'right') classes += 'mixte-gt-cell-align-right ';

      return classes;
    });

    const isExpandVisible = computed(() => {
      return column.field === expandColumnKey.value && displayedData.value.some(node => node.rawNode[childrenKey.value as any]?.length > 0);
    });

    const tdClasses = computed(() => {
      let classes = '';

      if (isExpandVisible.value) {
        classes += 'mixte-gt-cell-expand ';
      }

      return classes;
    });

    return {
      columnIndex,
      columnIsFirst,
      columnIsLast,

      fixedLeft,
      fixedLeftIndex,
      fixedRight,
      fixedRightIndex,

      cellClasses,
      cellStyle,
      zIndex,

      tdClasses,

      isExpandVisible,
    };
  });

  return {
    createColumnStore,
  };
});

export function useTh(column: GridTableColumn<Record<string, any>>) {
  const { tableWrapRef, fixedLeftColumns, fixedLeftColumnsRect, fixedRightColumns, fixedRightColumnsRect, tableTheadHeight } = useShared()!;
  const { createColumnStore } = useCell()!;
  const { columnIndex, fixedLeft, fixedLeftIndex, fixedRight, fixedRightIndex } = createColumnStore(column.field, column);

  const thRef = ref<HTMLDivElement>();

  // 当前列是第一列, 读取高度
  wheneverEffectScopeImmediate(() => columnIndex.value === 0, () => {
    syncRef(tableTheadHeight, useElementSize(thRef, undefined, { box: 'border-box' }).height, {
      direction: 'rtl',
    });
  });

  // 当前列是固定在左侧的, 读取宽度写入到表格上
  wheneverEffectScopeImmediate(() => fixedLeftColumns.value.length > 1 && fixedLeft.value && fixedLeftIndex.value < fixedLeftColumns.value.length, () => {
    const { width, left, right } = useElementBounding(thRef);

    watchImmediate([left, right], ([left, right]) => {
      fixedLeftColumnsRect.value[fixedLeftIndex.value] = { left: left ?? 0, right: right ?? 0 };
    });

    if (fixedLeftIndex.value < fixedLeftColumns.value.length - 1) {
      const css = useCssVar(() => `--mixte-gt-fix-left-column-${fixedLeftIndex.value}-width`, tableWrapRef);

      watchImmediate(width, (width) => {
        css.value = `${width}px`;
      });
    }
  });

  // 当前列是固定在右侧的, 读取宽度写入到表格上
  wheneverEffectScopeImmediate(() => fixedRightColumns.value.length > 1 && fixedRight.value && fixedRightIndex.value < fixedRightColumns.value.length, () => {
    const { width, left, right } = useElementBounding(thRef);

    watchImmediate([left, right], ([left, right]) => {
      fixedRightColumnsRect.value[fixedRightIndex.value] = { left: left ?? 0, right: right ?? 0 };
    });

    if (fixedRightIndex.value < fixedRightColumns.value.length - 1) {
      const css = useCssVar(() => `--mixte-gt-fix-right-column-${fixedRightIndex.value}-width`, tableWrapRef);

      watchImmediate(width, (width) => {
        css.value = `${width}px`;
      });
    }
  });

  return {
    thRef,
  };
}
