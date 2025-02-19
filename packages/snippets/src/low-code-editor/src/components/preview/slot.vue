<!--
  预览模式下, 组件列表的遍历渲染层
-->

<template>
  <div>preview slot, {{ list.length }}</div>
</template>

<script lang="ts" setup>
  import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';

  const list = defineModel<ComponentConfig<any>[]>('list', {
    default: () => [],
  });
</script>
