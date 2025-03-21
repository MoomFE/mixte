<template>
  <SenderHeader v-bind="senderHeaderProps">
    <slot />
  </SenderHeader>
</template>

<script lang="ts" setup>
  import type { RewriteSenderHeaderProps } from './types';
  import { transformKeys } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, useAttrs } from 'vue';
  import WrappedSenderHeader from './components-react/sender.header';

  defineOptions({ inheritAttrs: false });

  const props = defineProps<RewriteSenderHeaderProps>();

  const attrs = useAttrs();

  const SenderHeader = applyPureReactInVue(WrappedSenderHeader);

  const senderHeaderProps = computed(() => {
    return {
      ...props,
      ...transformKeys(attrs),
    };
  });
</script>
