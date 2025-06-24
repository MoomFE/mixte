import type { GridTableColumn } from '@mixte/components/grid-table/types';
import type { StyleValue } from 'vue';
import { columnIsFixedLeft, columnIsFixedRight } from '@mixte/components/grid-table/utils';
import { createNamedSharedComposable, watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState, useCssVar, useElementSize } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useShared } from './useShared';

export const [
  useCellStore,
  useCell,
] = createInjectionState(() => {
  const {
    childrenKey,
    expandColumnKey,

    displayedData,

    fixedLeftColumns,
    fixedRightColumns,

    tableWrapScroll,
  } = useShared()!;

  const createCellStore = createNamedSharedComposable((column: GridTableColumn<Record<string, any>>) => {
    const fixedLeft = computed(() => columnIsFixedLeft(column));
    const fixedLeftIndex = computed(() => fixedLeft.value ? fixedLeftColumns.value.findIndex(({ field }) => field === column.field) : -1);
    const fixedRight = computed(() => columnIsFixedRight(column));
    const fixedRightIndex = computed(() => fixedRight.value ? fixedRightColumns.value.findIndex(({ field }) => field === column.field) : -1);

    const style = computed(() => {
      const style: StyleValue = {};

      if (fixedLeft.value) {
        style.zIndex = fixedLeftIndex.value + 2;
        if (fixedLeftIndex.value === 0) style.left = '0';
        else style.left = `calc(${Array.from({ length: fixedLeftIndex.value }).map((_, i) => `var(--mixte-gt-fix-left-column-${i}-width)`).join('+')})`;
      }
      else if (fixedRight.value) {
        style.zIndex = fixedRightIndex.value + 2;
        if (fixedRightIndex.value === 0) style.right = '0';
        else style.right = `calc(${Array.from({ length: fixedRightIndex.value }).map((_, i) => `var(--mixte-gt-fix-right-column-${i}-width)`).join('+')})`;
      }

      return style;
    });

    const classes = computed(() => {
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
      return column.field === expandColumnKey.value && displayedData.value.some(node => node.rawNode[childrenKey.value]?.length > 0);
    });

    const cellClasses = computed(() => {
      let classes = '';

      if (isExpandVisible.value) {
        classes += 'mixte-gt-cell-expand ';
      }

      return classes;
    });

    return {
      classes,
      cellClasses,

      style,

      isExpandVisible,
    };
  });

  return {
    createCellStore,
  };
});

export function useTh(column: GridTableColumn<Record<string, any>>) {
  const { tableWrapRef, fixedLeftColumns, fixedRightColumns } = useShared()!;

  const thRef = ref<HTMLDivElement>();

  // 当前列是固定在左侧的
  wheneverEffectScopeImmediate(() => fixedLeftColumns.value.length > 1 && columnIsFixedLeft(column), () => {
    const index = computed(() => fixedLeftColumns.value.findIndex(({ field }) => field === column.field));

    wheneverEffectScopeImmediate(() => index.value < fixedLeftColumns.value.length - 1, () => {
      const css = useCssVar(() => `--mixte-gt-fix-left-column-${index.value}-width`, tableWrapRef);
      const width = useElementSize(thRef, undefined, { box: 'border-box' }).width;

      watchImmediate(width, (width) => {
        css.value = `${width}px`;
      });
    });
  });

  // 当前列是固定在右侧的
  wheneverEffectScopeImmediate(() => fixedRightColumns.value.length > 1 && columnIsFixedRight(column), () => {
    const index = computed(() => fixedRightColumns.value.findIndex(({ field }) => field === column.field));

    wheneverEffectScopeImmediate(() => index.value < fixedRightColumns.value.length - 1, () => {
      const css = useCssVar(() => `--mixte-gt-fix-right-column-${index.value}-width`, tableWrapRef);
      const width = useElementSize(thRef, undefined, { box: 'border-box' }).width;

      watchImmediate(width, (width) => {
        css.value = `${width}px`;
      });
    });
  });

  return {
    thRef,
  };
}
