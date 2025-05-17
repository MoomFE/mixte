import type { GridTableProps } from '@mixte/components/grid-table/types';
import type { StyleValue } from 'vue';
import { createInjectionState } from '@vueuse/core';
import { computed, toValue } from 'vue';

export const [
  useSharedStore,
  useShared,
] = createInjectionState((props: GridTableProps<any>) => {
  const tableWrapRef = ref<HTMLDivElement>();
  const tableWrapSize = reactive(useElementSize(tableWrapRef));

  const rowKey = computed(() => {
    return toValue(props.rowKey) ?? 'id';
  });

  const tableStyle = computed<StyleValue>(() => {
    let gridTemplateColumns = '';

    if (props.columns?.length) {
      for (const column of props.columns) {
        gridTemplateColumns += 'auto ';
      }
    }

    return {
      gridTemplateColumns,
    };
  });

  return {
    props,

    tableWrapRef,
    tableWrapSize,

    rowKey,

    tableStyle,
  };
});
