<!-- 表体 -->

<template>
  <div v-if="isModernRenderMode" class="mixte-gt-tbody">
    <component :is="h(Trs, null, $slots)" />
  </div>
  <component v-else :is="h(Trs, null, $slots)" />
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import { h } from 'vue';
  import { useShared } from '../composables/useShared';
  import Trs from './trs.vue';

  defineSlots<GridTableFieldsSlots<any>>();

  const { isModernRenderMode } = useShared()!;
</script>
