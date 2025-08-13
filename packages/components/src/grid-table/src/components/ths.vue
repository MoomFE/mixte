<!-- 整行表头单元格 -->

<template>
  <template v-for="column in columns" :key="column.field">
    <component :is="h(Th, { column }, $slots)" />
  </template>
</template>

<script lang="ts" setup>
  import type { GridTableHeaderSlots } from '@mixte/components/grid-table/types';
  import { h } from 'vue';
  import { useShared } from '../composables/useShared';
  import Th from './th.vue';

  defineSlots<GridTableHeaderSlots<any>>();

  const {
    columns,
  } = useShared()!;
</script>
