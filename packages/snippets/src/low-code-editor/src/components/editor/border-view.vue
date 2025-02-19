<!--
  编辑器模式下, 组件边框线
-->

<template>
  <div
    v-if="hoverComponentElement"
    ref="rootRef"
    :style fixed pointer-events-none b="1 solid blue-6"
  />
</template>

<script lang="ts" setup>
  import { useEditor } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { computed, ref } from 'vue';

  const rootRef = ref<HTMLDivElement>();

  const {
    hoverComponentElement, hoverComponentRect, // eslint-disable-line antfu/consistent-list-newline
  } = useEditor()!;

  const style = computed(() => {
    return {
      width: `${hoverComponentRect.width}px`,
      height: `${hoverComponentRect.height}px`,
      left: `${hoverComponentRect.x}px`,
      top: `${hoverComponentRect.y}px`,
    };
  });
</script>
