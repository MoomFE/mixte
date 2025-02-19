<!--
  低代码编辑器容器
-->

<template>
  <slot />
</template>

<script lang="ts" setup>
  import { useEditorStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';

  useEditorStore();
</script>
