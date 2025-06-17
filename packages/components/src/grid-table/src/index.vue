<template>
  <div ref="tableWrapRef" class="mixte-gt-wrap">
    <div class="mixte-gt" :style="tableWrapStyle">
      <!-- 表头 -->
      <component v-if="columns?.length" :is="h(Thead, null, $slots)" />
      <!-- 表体 -->
      <component v-if="columns?.length && data?.length" :is="h(Tbody, null, $slots)" />
      <!-- 无数据 -->
      <Empty v-else />
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
  import type { GridTableProps, GridTableSlots } from '@mixte/components/grid-table/types';
  import { h } from 'vue';
  import Empty from './components/empty.vue';
  import Loading from './components/loading.vue';
  import Tbody from './components/tbody.vue';
  import Thead from './components/thead.vue';
  import { useCellStore } from './composables/useCell';
  import { useSharedStore } from './composables/useShared';

  const props = defineProps<GridTableProps<Fields>>();
  const slots = defineSlots<GridTableSlots<Fields>>();

  const {
    tableWrapRef,
    tableWrapStyle,
  } = useSharedStore(props, slots);

  useCellStore();
</script>
