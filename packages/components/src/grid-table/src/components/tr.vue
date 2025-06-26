<template>
  <template v-for="column in tableProps.columns" :key="column.field">
    <component :is="h(Td, { node, column, index }, $slots)" />
  </template>
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import type { TreeNode } from 'treemate';
  import { h } from 'vue';
  import { useShared } from '../composables/useShared';
  import Td from './td.vue';

  interface Props {
    node: TreeNode<any>;
    index: number;
  }

  defineProps<Props>();

  defineSlots<GridTableFieldsSlots<any>>();

  const { props: tableProps } = useShared()!;
</script>
