<template>
  <MixteAutoGrid :list="list" item-width="310" gap="10">
    <template #default="{ item, index }">
      <div c-black bg-neutral-2 rounded p="x2 y1">
        item: {{ item }},
        index: {{ index }}
      </div>
    </template>
  </MixteAutoGrid>
</template>

<script lang="ts" setup>
  import { MixteAutoGrid } from '@mixte/components/auto-grid';

  const list = ref([
    { id: 1, title: 'item-1' },
    { id: 2, title: 'item-2' },
    { id: 3, title: 'item-3' },
    { id: 4, title: 'item-4' },
    { id: 5, title: 'item-5' },
    { id: 6, title: 'item-6' },
    { id: 7, title: 'item-7' },
    { id: 8, title: 'item-8' },
    { id: 9, title: 'item-9' },
    { id: 10, title: 'item-10' },
  ]);
</script>
