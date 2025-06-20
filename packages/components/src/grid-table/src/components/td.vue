<template>
  <div class="mixte-gt-cell mixte-gt-td" :class="[classes, cellClasses]" :style>
    <!-- 展开子级数据的按钮 -->
    <button
      v-if="isExpandVisible"
      class="mixte-gt-cell-expand-icon"
      :class="{ 'mixte-gt-cell-expand-icon-spaced': expandIconSpaced }"
      :style="{ marginLeft: `${(node?.level ?? 0) * 15}px` }"
      @click="updateExpanded(record[rowKey])"
    >
      <template v-if="!expandIconSpaced">
        <i-ant-design-minus-outlined v-if="expandedRowSet.has(node.key as string)" />
        <i-ant-design-plus-outlined v-else />
      </template>
    </button>

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
  import type { TreeNode } from 'treemate';
  import { isFunction } from 'mixte';
  import { computed } from 'vue';
  import { useCell } from '../composables/useCell';
  import { useShared } from '../composables/useShared';

  interface Props {
    node: TreeNode<any>;
    column: GridTableColumn<Record<string, any>>;
    index: number;
  }

  const props = defineProps<Props>();

  defineSlots<GridTableFieldsSlots<any>>();

  const { expandedRowSet, rowKey, childrenKey, updateExpanded } = useShared()!;
  const { createCellStore } = useCell()!;
  const { classes, cellClasses, style, isExpandVisible } = createCellStore(props.column.field, props.column);

  const record = computed(() => props.node.rawNode);
  const value = computed(() => record.value[props.column.field]);

  const expandIconSpaced = computed(() => !record.value[childrenKey.value]?.length);
</script>
