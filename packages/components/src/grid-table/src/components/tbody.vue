<!-- 表体 -->

<template>
  <div class="mixte-gt-tbody">
    <template v-if="props.virtual">
      <Tr v-for="(record, index) in data" :key="record[rowKey]" :record :index="visibleStart + index" />
    </template>
    <template v-else>
      <Tr v-for="(record, index) in data" :key="record[rowKey]" :record :index />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import { useShared } from '../composables/useShared';
  import { useVirtual } from '../composables/useVirtual';
  import Tr from './tr.vue';

  defineSlots<GridTableFieldsSlots<any>>();

  const { props, rowKey } = useShared()!;
  const { data, visibleStart } = useVirtual()!;
</script>
