<template>
  <div
    ref="thRef"
    class="mixte-gt-cell mixte-gt-th"
    :class="classes"
    :style
  >
    <!-- 自定义渲染 -->
    <component
      v-if="isFunction(column.headerRender)"
      :is="column.headerRender"
      :column="column"
    />
    <!-- 正常渲染 -->
    <template v-else>
      {{ column.title }}
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableColumn } from '@mixte/components/grid-table/types';
  import { isFunction } from 'mixte';
  import { useCell, useTh } from '../composables/useCell';

  interface Props {
    column: GridTableColumn<Record<string, any>>;
  }

  const props = defineProps<Props>();

  const { createCellStore } = useCell()!;
  const { classes, style } = createCellStore(props.column.field, props.column);

  const { thRef } = useTh(props.column);
</script>
