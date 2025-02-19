<!--
  组件列表
    - 展现组件分组, 可拖拽组件至画布中
-->

<template>
  <div />
</template>

<script lang="ts" setup>
  import { useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';

  const { componentsInfo } = useStore()!;
</script>
