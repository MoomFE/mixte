<template>
  <div ref="tableWrapRef" class="mixte-gt-wrap">
    <div ref="tableRef" class="mixte-gt" :style="tableWrapStyle">
      <!-- 表体 -->
      <component v-if="showTbody" :is="h(Tbody, null, $slots)" />
      <!-- 表头 -->
      <component v-if="showThead" :is="h(Thead, null, $slots)" />
      <!-- 无数据 -->
      <Empty v-if="!showTbody" />
    </div>
    <!-- 加载中 -->
    <Loading v-if="loading" />
  </div>
</template>

<script
  setup
  lang="ts"
  generic="Fields extends Record<string, any>"
>
  import type { GridTableExpose, GridTableProps, GridTableSlots } from '@mixte/components/grid-table/types';
  import { computed, h } from 'vue';
  import Empty from './components/empty.vue';
  import Loading from './components/loading.vue';
  import Tbody from './components/tbody.vue';
  import Thead from './components/thead.vue';
  import { useCellStore } from './composables/useCell';
  import { useSelectionStore } from './composables/useSelection';
  import { useSharedStore } from './composables/useShared';
  import { useTreeDataStore } from './composables/useTreeData';
  import { useVirtualStore } from './composables/useVirtual';

  const props = defineProps<GridTableProps<Fields>>();
  const slots = defineSlots<GridTableSlots<Fields>>();

  const expandedRowKeys = defineModel<string[]>('expandedRowKeys', {
    default: () => [],
  });

  const selectedRowKeys = defineModel<string[]>('selectedRowKeys', {
    default: () => [],
  });

  const {
    tableWrapRef,
    tableWrapStyle,

    tableRef,
  } = useSharedStore(props, slots, {
    expandedRowKeys,
    selectedRowKeys,
  });

  const { expandAllRows, expandRows, collapseAllRows, collapseRows } = useTreeDataStore();

  useVirtualStore();

  useCellStore();

  useSelectionStore();

  const showThead = computed(() => !!props.columns?.length);
  const showTbody = computed(() => !!props.columns?.length && !!props.data?.length);

  defineExpose<GridTableExpose>({
    expandAllRows,
    collapseAllRows,
    expandRows,
    collapseRows,
  });
</script>
