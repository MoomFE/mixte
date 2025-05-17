<!-- 表体 -->

<template>
  <div class="mixte-gt-tbody">
    <template v-for="(record, index) in props.data" :key="record[rowKey]">
      <!-- 表格行 -->
      <div class="mixte-gt-tr">
        <!-- 表体单元格 -->
        <template v-for="column in props.columns" :key="column.field">
          <Td :column :record :index />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useShared } from '../composables/useShared';
  import Td from './td.vue';

  const { props, rowKey } = useShared()!;
</script>
