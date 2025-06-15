<!-- 表体 -->

<template>
  <div class="mixte-gt-tbody">
    <template v-for="(record, index) in props.data" :key="record[rowKey]">
      <!-- 表格行 -->
      <div class="mixte-gt-tr">
        <!-- 表体单元格 -->
        <template v-for="column in props.columns" :key="column.field">
          <component :is="h(Td, { column, record, index }, $slots)" />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import { h } from 'vue';
  import { useShared } from '../composables/useShared';
  import Td from './td.vue';

  defineSlots<GridTableFieldsSlots<any>>();

  const { props, rowKey } = useShared()!;
</script>
