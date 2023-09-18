<template>
  <AutoGrid>
    <template v-for="i in 30" :key="i">
      <div>item-{{ i }}</div>
    </template>
  </AutoGrid>
</template>

<script lang="ts" setup>
  import { AutoGrid } from '@mixte/components';
</script>
