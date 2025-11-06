<!--
  表体单元格代理组件
    - 用于将部分逻辑前置, 减少 Td 中不必要的组件渲染和逻辑判断
-->

<template>
  <component
    v-if="isNotSkip"
    :is="h(Td, { node, column, index }, $slots)"
  />
</template>

<script lang="ts" setup>
  import type { GridTableColumn } from '@mixte/components/grid-table/types';
  import type { TreeNode } from 'treemate';
  import { computed, h } from 'vue';
  import { useCell } from '../composables/useCell';
  // import { useShared } from '../composables/useShared';
  import { useSpan } from '../composables/useSpan';
  // import { useVirtual } from '../composables/useVirtual';
  import Td from './td.vue';

  interface Props {
    node: TreeNode<any>;
    column: GridTableColumn<Record<string, any>>;
    index: number;
  }

  const props = defineProps<Props>();

  // const { props: tableProps } = useShared()!;
  // const { visibleStart, dataStart } = useVirtual()!;
  const { createColumnStore } = useCell()!;
  const { columnIndex } = createColumnStore(props.column.field, props.column);
  const { spanMatrix } = useSpan()!;

  const matrixMeta = computed(() => spanMatrix.value[props.index]?.[columnIndex.value]);

  const isNotSkip = computed(() => matrixMeta.value.skip !== true);

  // const isSpanRow = computed(() => {
  //   if (!tableProps.virtual || visibleStart.value === dataStart.value) return false;
  //   return props.index < visibleStart.value;
  // });

  // const isSpanCell = computed(() => {
  //   if (!isSpanRow.value) return false;
  //   return matrixMeta.value.rowSpan > 1;
  // });

  //  && (isSpanRow ? isSpanCell : true)
</script>
