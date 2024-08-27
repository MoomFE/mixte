<template>
  <MixteListAutoGrid :list="24" item-width="150" gap="10">
    <template #default="{ item, index }">
      <div c-black bg-neutral-2 rounded p="x2 y1">
        item: {{ item }},
        index: {{ index }}
      </div>
    </template>
  </MixteListAutoGrid>
</template>

<script lang="ts" setup>
  import { MixteListAutoGrid } from '@mixte/components/list-auto-grid';
</script>
