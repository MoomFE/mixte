<!-- 表体 -->

<template>
  <div class="mixte-gt-tbody">
    <template v-for="item in props.data" :key="item[rowKey]">
      <!-- 表格行 -->
      <div class="mixte-gt-tr">
        <!-- 表体单元格 -->
        <template v-for="column in props.columns" :key="column.field">
          <div class="mixte-gt-cell mixte-gt-td">{{ item[column.field] }}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useShared } from '../composables/useShared';

  const { props, rowKey } = useShared()!;
</script>
