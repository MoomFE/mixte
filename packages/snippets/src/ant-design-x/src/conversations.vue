<template>
  <Conversations
    v-bind="conversationsProps"
    :active-key
    @active-change="proxyOnActiveChange"
  />
</template>

<script lang="ts" setup>
  import type { RewriteConversationsProps } from './types';
  import { transformKeys } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, useAttrs } from 'vue';
  import WrappedConversations from './components-react/conversations';

  defineOptions({ inheritAttrs: false });

  const props = defineProps<RewriteConversationsProps>();

  const activeKey = defineModel<RewriteConversationsProps['activeKey']>('activeKey');

  const attrs = useAttrs() as RewriteConversationsProps;

  const Conversations = applyPureReactInVue(WrappedConversations);

  const conversationsProps = computed(() => {
    return {
      ...props,
      ...transformKeys(attrs),
    };
  });

  const proxyOnActiveChange: RewriteConversationsProps['onActiveChange'] = (...args: Parameters<NonNullable<RewriteConversationsProps['onActiveChange']>>) => {
    activeKey.value = args[0];
    attrs.onActiveChange?.(...args);
  };
</script>
