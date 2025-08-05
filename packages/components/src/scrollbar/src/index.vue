<template>
  <div ref="rootRef" class="mixte-scrollbar">
    <div
      ref="contentRef"
      class="mixte-scrollbar-content"
      :class="[contentClass]"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ScrollbarProps } from '@mixte/components/scrollbar/types';
  import { useSharedStore } from './composables/useShared';

  const props = defineProps<ScrollbarProps>();

  const { rootRef, contentRef } = useSharedStore(props);

  defineExpose({
    rootRef,
    contentRef,
  });
</script>
