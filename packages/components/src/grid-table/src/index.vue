<template>
  <div ref="tableWrapRef" class="mixte-gt-wrap">
    <div class="mixte-gt" :style="tableStyle">
      <!-- 表头 -->
      <Thead />
      <!-- 表体 -->
      <Tbody />
      <!-- 无数据 -->
      <Empty v-if="!data?.length" />
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
  import { useSharedStore } from './composables/useShared';

  const props = defineProps<GridTableProps<Fields>>();

  const {
    tableWrapRef,
    tableStyle,
  } = useSharedStore(props);
</script>
