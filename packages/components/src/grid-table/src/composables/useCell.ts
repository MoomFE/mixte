import type { GridTableColumn } from '@mixte/components/grid-table/types';
import type { StyleValue } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '@mixte/components/grid-table/utils';
import { createNamedSharedComposable, watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState, syncRef, useCssVar, useElementSize } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useShared } from './useShared';

export const [
  useCellStore,
  useCell,
] = createInjectionState(() => {
  const {
    props,

    childrenKey,
    expandColumnKey,

    displayedData,

    fixedLeftColumns,
    fixedRightColumns,

    tableWrapScroll,
  } = useShared()!;

  const createColumnStore = createNamedSharedComposable((column: GridTableColumn<Record<string, any>>) => {
    const columnIndex = computed(() => props.columns?.findIndex(({ field }) => field === column.field) ?? -1);
    const fixedLeft = computed(() => columnIsFixedLeft(column));
    const fixedLeftIndex = computed(() => fixedLeft.value ? fixedLeftColumns.value.findIndex(({ field }) => field === column.field) : -1);
    const fixedRight = computed(() => columnIsFixedRight(column));
    const fixedRightIndex = computed(() => fixedRight.value ? fixedRightColumns.value.findIndex(({ field }) => field === column.field) : -1);

    const zIndex = computed(() => {
      if (fixedLeft.value) return fixedLeftIndex.value + 2;
      if (fixedRight.value) return fixedRightIndex.value + 2;
    });

    const cellStyle = computed(() => {
      const style: StyleValue = {};

      if (fixedLeft.value) {
        if (fixedLeftIndex.value === 0) style.left = '0';
        else style.left = `calc(${Array.from({ length: fixedLeftIndex.value }).map((_, i) => `var(--mixte-gt-fix-left-column-${i}-width)`).join('+')})`;
      }
      else if (fixedRight.value) {
        if (fixedRightIndex.value === 0) style.right = '0';
        else style.right = `calc(${Array.from({ length: fixedRightIndex.value }).map((_, i) => `var(--mixte-gt-fix-right-column-${i}-width)`).join('+')})`;
      }

      return style;
    });

    const cellClasses = computed(() => {
      let classes = '';

      if (fixedLeft.value) {
        classes += 'mixte-gt-cell-fix mixte-gt-cell-fix-left ';
        if (tableWrapScroll.arrivedState.left === false) classes += 'mixte-gt-cell-fix-left-active ';
      }
      else if (fixedRight.value) {
        classes += 'mixte-gt-cell-fix mixte-gt-cell-fix-right ';
        if (tableWrapScroll.arrivedState.right === false) classes += 'mixte-gt-cell-fix-right-active ';
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
  const { tableWrapRef, fixedLeftColumns, fixedRightColumns, tableTheadHeight } = useShared()!;
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
  wheneverEffectScopeImmediate(() => fixedLeftColumns.value.length > 1 && fixedLeft.value && fixedLeftIndex.value < fixedLeftColumns.value.length - 1, () => {
    const css = useCssVar(() => `--mixte-gt-fix-left-column-${fixedLeftIndex.value}-width`, tableWrapRef);
    const width = useElementSize(thRef, undefined, { box: 'border-box' }).width;

    watchImmediate(width, (width) => {
      css.value = `${width}px`;
    });
  });

  // 当前列是固定在右侧的, 读取宽度写入到表格上
  wheneverEffectScopeImmediate(() => fixedRightColumns.value.length > 1 && fixedRight.value && fixedRightIndex.value < fixedRightColumns.value.length - 1, () => {
    const css = useCssVar(() => `--mixte-gt-fix-right-column-${fixedRightIndex.value}-width`, tableWrapRef);
    const width = useElementSize(thRef, undefined, { box: 'border-box' }).width;

    watchImmediate(width, (width) => {
      css.value = `${width}px`;
    });
  });

  return {
    thRef,
  };
}
