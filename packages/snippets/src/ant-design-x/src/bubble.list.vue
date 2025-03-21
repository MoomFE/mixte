<template>
  <BubbleList v-bind="bubbleListProps" />
</template>

<script lang="ts" setup>
  import type { RewriteBubbleListProps } from './types';
  import { transformKeys } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, useAttrs } from 'vue';
  import WrappedBubbleList from './components-react/bubble.list';

  defineOptions({ inheritAttrs: false });

  const props = defineProps<RewriteBubbleListProps>();

  const attrs = useAttrs();

  const BubbleList = applyPureReactInVue(WrappedBubbleList);

  const bubbleListProps = computed(() => {
    return {
      ...props,
      ...transformKeys(attrs),
    };
  });
</script>
