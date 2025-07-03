<template>
  <div
    ref="thRef"
    class="mixte-gt-cell mixte-gt-th"
    :class="[cellClasses, column.cellClass, column.headerCellClass]"
    :style="[cellStyle, { zIndex: (zIndex ?? 0) + 1 }]"
    :data-field="column.field"
  >
    <!-- 自定义渲染 -->
    <component v-if="isFunction(column.headerRender)" :is="column.headerRender" :column />
    <!-- 指定字段表头单元格插槽 -->
    <slot v-else-if="$slots[`header-${column.field}`]" :name="`header-${column.field}`" :column />
    <!-- 通用表头单元格插槽 -->
    <slot v-else-if="$slots.header" name="header" :column />
    <!-- 正常渲染 -->
    <template v-else> {{ column.title }}</template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableColumn, GridTableHeaderSlots } from '@mixte/components/grid-table/types';
  import { isFunction } from 'mixte';
  import { useCell, useTh } from '../composables/useCell';

  interface Props {
    column: GridTableColumn<Record<string, any>>;
  }

  const props = defineProps<Props>();

  defineSlots<GridTableHeaderSlots<any>>();

  const { createColumnStore } = useCell()!;
  const { cellClasses, cellStyle, zIndex } = createColumnStore(props.column.field, props.column);

  const { thRef } = useTh(props.column);
</script>
