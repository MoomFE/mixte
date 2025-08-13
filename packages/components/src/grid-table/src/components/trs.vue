<!-- 所有表体表格行 -->

<template>
  <template v-if="props.virtual">
    <!-- 虚拟表格占位 -->
    <div
      v-if="isLegacyRenderMode"
      class="mixte-gt-virtual-placeholder"
      :style="{ gridColumnStart: `span ${columns?.length}` }"
    />
    <!-- 虚拟表格 -->
    <component
      v-for="(node, index) in data" :key="node.key"
      :is="h(Tr, { node, index: visibleStart + index }, $slots)"
    />
  </template>
  <template v-else>
    <component
      v-for="(node, index) in displayedData" :key="node.key"
      :is="h(Tr, { node, index }, $slots)"
    />
  </template>
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import { h } from 'vue';
  import { useShared } from '../composables/useShared';
  import { useTreeData } from '../composables/useTreeData';
  import { useVirtual } from '../composables/useVirtual';
  import Tr from './tr.vue';

  defineSlots<GridTableFieldsSlots<any>>();

  const { props, columns, isLegacyRenderMode } = useShared()!;
  const { displayedData } = useTreeData()!;
  const { data, visibleStart } = useVirtual()!;
</script>
