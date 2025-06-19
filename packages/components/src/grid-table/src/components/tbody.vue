<!-- 表体 -->

<template>
  <div class="mixte-gt-tbody">
    <template v-if="props.virtual">
      <component
        v-for="(record, index) in data" :key="record[rowKey]"
        :is="h(Tr, { record, index: visibleStart + index }, $slots)"
      />
    </template>
    <template v-else>
      <component
        v-for="(record, index) in data" :key="record[rowKey]"
        :is="h(Tr, { record, index }, $slots)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import { h } from 'vue';
  import { useShared } from '../composables/useShared';
  import { useVirtual } from '../composables/useVirtual';
  import Tr from './tr.vue';

  defineSlots<GridTableFieldsSlots<any>>();

  const { props, rowKey } = useShared()!;
  const { data, visibleStart } = useVirtual()!;
</script>
