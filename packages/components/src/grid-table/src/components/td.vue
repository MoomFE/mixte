<template>
  <div class="mixte-gt-cell mixte-gt-td" :class="classes" :style>
    <!-- 自定义渲染 -->
    <component
      v-if="isFunction(column.render)"
      :is="column.render"
      :value :record :column :index
    />
    <!-- 指定字段单元格插槽 -->
    <slot
      v-else-if="$slots[`cell-${column.field}`]"
      :name="`cell-${column.field}`"
      :value :record :column :index
    />
    <!-- 通用字段单元格插槽 -->
    <slot
      v-else-if="$slots.cell"
      name="cell"
      :value :record :column :index
    />
    <!-- 值 -->
    <template v-else>
      {{ value }}
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableColumn, GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import { isFunction } from 'mixte';
  import { computed } from 'vue';
  import { useCell } from '../composables/useCell';

  interface Props {
    record: Record<string, any>;
    column: GridTableColumn<Record<string, any>>;
    index: number;
  }

  const props = defineProps<Props>();

  defineSlots<GridTableFieldsSlots<any>>();

  const { createCellStore } = useCell()!;
  const { classes, style } = createCellStore(props.column.field, props.column);

  const value = computed(() => {
    return props.record[props.column.field];
  });
</script>
