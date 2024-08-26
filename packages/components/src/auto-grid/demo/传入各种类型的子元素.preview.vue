<template>
  <MixteAutoGrid item-width="120" gap="8">
    <!-- 文本节点 -->
    文本节点

    <!-- 元素节点 -->
    <div>元素节点</div>

    <!-- 列表渲染会被展开 -->
    <template v-for="label in '列表渲染会被展开'" :key="label">
      <div>{{ label }}</div>
    </template>

    <!-- 组件 -->
    <el-button w-full type="primary">组件</el-button>
  </MixteAutoGrid>
</template>

<script lang="ts" setup>
  import { MixteAutoGrid } from '@mixte/components/auto-grid';
</script>

<style lang="scss" scoped>
  .mixte-auto-grid > :deep(div) {
    @apply min-h-8 flex-(~ justify-center items-center) text-(sm center) p-2;
    @apply bg-neutral-200 dark:(bg-neutral-800 text-white);
  }
</style>
