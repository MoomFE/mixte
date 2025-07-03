<template>
  <div
    ref="tdRef"
    class="mixte-gt-cell mixte-gt-td"
    :class="[cellClasses, tdClasses, column.cellClass, column.contentCellClass]"
    :style="[cellStyle, { zIndex }]"
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
      :style="{ marginLeft: `${(node?.level ?? 0) * 15}px` }"
      @click="updateExpanded(record[rowKey])"
    >
      <template v-if="!expandIconSpaced">
        <i-ant-design-minus-outlined v-if="expanded" />
        <i-ant-design-plus-outlined v-else />
      </template>
    </button>

    <!-- 自定义渲染 -->
    <component v-if="isFunction(column.render)" :is="column.render" :value :record :column :index />
    <!-- 指定字段单元格插槽 -->
    <slot v-else-if="$slots[`cell-${column.field}`]" :name="`cell-${column.field}`" :value :record :column :index />
    <!-- 通用字段单元格插槽 -->
    <slot v-else-if="$slots.cell" name="cell" :value :record :column :index />
    <!-- 值 -->
    <template v-else>{{ value }}</template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableColumn, GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import type { TreeNode } from 'treemate';
  import { wheneverEffectScopeImmediate } from '@mixte/use';
  import { useElementSize } from '@vueuse/core';
  import { isFunction } from 'mixte';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useCell } from '../composables/useCell';
  import { useShared } from '../composables/useShared';
  import { useVirtual } from '../composables/useVirtual';

  interface Props {
    node: TreeNode<any>;
    column: GridTableColumn<Record<string, any>>;
    index: number;
  }

  const props = defineProps<Props>();

  defineSlots<GridTableFieldsSlots<any>>();

  const tdRef = ref<HTMLDivElement>();

  const { props: tableProps, expandedRowSet, rowKey, childrenKey, updateExpanded } = useShared()!;
  const { createColumnStore } = useCell()!;
  const { columnIndex, cellClasses, cellStyle, zIndex, tdClasses, isExpandVisible } = createColumnStore(props.column.field, props.column);

  const record = computed(() => props.node.rawNode);
  const value = computed(() => record.value[props.column.field]);

  const expandIconSpaced = computed(() => !record.value[childrenKey.value]?.length);
  const expanded = computed(() => expandedRowSet.value.has(props.node.key as string));

  onMounted(() => {
    const { updateRowHeight } = useVirtual()!;

    wheneverEffectScopeImmediate(() => tableProps.virtual && columnIndex.value === 0, () => {
      const height = useElementSize(tdRef, undefined, { box: 'border-box' }).height;

      watch(height, (height) => {
        updateRowHeight(props.index, props.node.rawNode, height);
      });
    });
  });
</script>
