<template>
  <MixteScrollbar class="h-80">
    <div flex="~ col gap-2">
      <template v-for="item in 1000" :key="item">
        <div text-center px-2 py-2 style="background-color: var(--el-color-primary-light-7)">
          {{ item }}
        </div>
      </template>
    </div>
  </MixteScrollbar>
</template>

<script lang="ts" setup>
  import { MixteScrollbar } from '@mixte/components/scrollbar';
</script>
