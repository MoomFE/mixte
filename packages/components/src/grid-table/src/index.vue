<template>
  <div ref="tableWrapRef" class="mixte-gt-wrap">
    <div class="mixte-gt" :style="tableWrapStyle">
      <!-- 表头 -->
      <Thead />
      <!-- 表体 -->
      <Tbody v-if="data?.length" />
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
  import type { GridTableProps } from '@mixte/components/grid-table/types';
  import Empty from './components/empty.vue';
  import Loading from './components/loading.vue';
  import Tbody from './components/tbody.vue';
  import Thead from './components/thead.vue';
  import { useCellStore } from './composables/useCell';
  import { useSharedStore } from './composables/useShared';

  const props = defineProps<GridTableProps<Fields>>();

  const {
    tableWrapRef,
    tableWrapStyle,
  } = useSharedStore(props);

  useCellStore();
</script>
