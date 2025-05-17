<!-- 表头 -->

<template>
  <div class="mixte-gt-thead">
    <!-- 表格行 -->
    <div class="mixte-gt-tr">
      <!-- 表头单元格 -->
      <template v-for="column in props.columns" :key="column.field">
        <div class="mixte-gt-cell mixte-gt-th">{{ column.title }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useShared } from '../composables/useShared';

  const { props } = useShared()!;
</script>
