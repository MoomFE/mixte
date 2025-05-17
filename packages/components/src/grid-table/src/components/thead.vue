<!-- 表头 -->

<template>
  <div ref="tableTheadRef" class="mixte-gt-thead">
    <!-- 表格行 -->
    <div class="mixte-gt-tr">
      <!-- 表头单元格 -->
      <template v-for="column in props.columns" :key="column.field">
        <Th :column />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useShared } from '../composables/useShared';
  import Th from './th.vue';

  const {
    props,
    tableTheadRef,
  } = useShared()!;
</script>
