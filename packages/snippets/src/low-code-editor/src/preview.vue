<!--
  页面预览页
-->

<template>
  <FinalSlot v-model:list="list" />
</template>

<script lang="ts" setup>
  import { usePreview, useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import DefaultSlot from './components/preview/slot.vue';

  const { list } = useStore()!;

  const FinalSlot = usePreview()?.Slot ?? DefaultSlot;
</script>
