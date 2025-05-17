<template>
  <div
    ref="thRef"
    class="mixte-gt-cell mixte-gt-th"
    :class="classes"
    :style
  >
    {{ column.title }}
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableColumn } from '@mixte/components/grid-table/types';
  import { useCell, useTh } from '../composables/useCell';

  interface Props {
    column: GridTableColumn<Record<string, any>>;
  }

  const props = defineProps<Props>();

  const { createCellStore } = useCell()!;
  const { classes, style } = createCellStore(props.column.field, props.column);

  const { thRef } = useTh(props.column);
</script>
