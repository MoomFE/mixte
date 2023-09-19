<template>
  <AutoGrid item-width="100" gap-2>
    <template v-for="i in 30" :key="i">
      <div bg-gray-2>item-{{ i }}</div>
    </template>
  </AutoGrid>
</template>

<script lang="ts" setup>
  import { AutoGrid } from '@mixte/components';
</script>
