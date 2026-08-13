<!-- 表体单元格 -->

<template>
  <div
    :ref="setRowRef"
    class="mixte-gt-cell mixte-gt-td"
    :class="[cellClasses, tdClasses, tdClassesFn(index), tableProps.cellClass, tableProps.contentCellClass, column.cellClass, column.contentCellClass]"
    :style="[cellStyle, { zIndex }, tdStyleFn(index)]"
    :data-field="column.field"
    :data-index="index"
  >
    <!-- 展开子级数据的按钮 -->
    <button
      v-if="isExpandVisible"
      class="mixte-gt-cell-expand-btn"
      :class="[
        // 无子级数据时的占位
        { 'mixte-gt-cell-expand-btn-spaced': expandIconSpaced },
        // 展开/收起状态
        expandIconSpaced
          ? undefined
          : expanded ? 'mixte-gt-cell-expand-btn-expanded' : 'mixte-gt-cell-expand-btn-collapsed',
      ]"
      :style="{ marginLeft: `${(node?.level ?? 0) * expandedIndent}px` }"
      @click="updateExpanded(record[rowKey])"
    >
      <template v-if="!expandIconSpaced">
        <i-ant-design-minus-outlined v-if="expanded" />
        <i-ant-design-plus-outlined v-else />
      </template>
    </button>

    <!-- 自定义渲染 -->
    <component v-if="isFunction(column.render)" :is="column.render" :value :record :column :columnIndex :index /> <!-- eslint-disable-line vue/attribute-hyphenation -->
    <!-- 指定字段单元格插槽 -->
    <slot v-else-if="$slots[`cell-${column.field}`]" :name="`cell-${column.field}`" :value :record :column :column-index :index />
    <!-- 通用字段单元格插槽 -->
    <slot v-else-if="$slots.cell" name="cell" :value :record :column :column-index :index />
    <!-- 值 -->
    <template v-else>{{ value }}</template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableColumn, GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import type { TreeNode } from 'treemate';
  import { get, isFunction } from 'mixte';
  import { computed } from 'vue';
  import { useCell } from '../composables/useCell';
  import { useShared } from '../composables/useShared';
  import { useTreeData } from '../composables/useTreeData';
  import { useVirtual } from '../composables/useVirtual';

  interface Props {
    node: TreeNode<any>;
    column: GridTableColumn<Record<string, any>>;
    index: number;
  }

  const props = defineProps<Props>();

  defineSlots<GridTableFieldsSlots<any>>();

  const { props: tableProps, rowKey, childrenKey, expandedIndent } = useShared()!;
  const { expandedRowKeySet, updateExpanded } = useTreeData()!;
  const { createColumnStore } = useCell()!;
  const { columnIndex, cellClasses, cellStyle, zIndex, tdClasses, tdClassesFn, tdStyleFn, isExpandVisible } = createColumnStore(props.column.field, props.column);

  const { useRowMeasure } = useVirtual()!;
  const { setRowRef } = useRowMeasure(props.node, () => props.index, columnIndex);

  const record = computed(() => props.node.rawNode);
  const value = computed(() => get(record.value, props.column.field));

  const expandIconSpaced = computed(() => !record.value[childrenKey.value]?.length);
  const expanded = computed(() => expandedRowKeySet.value.has(props.node.key as string));
</script>
