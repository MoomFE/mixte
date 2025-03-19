<template>
  <XProvider v-bind="attrs">
    <template
      v-for="(_, name) in slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot v-bind="slotProps" :key="name" :name="name" />
    </template>
  </XProvider>
</template>

<script lang="ts" setup>
  import type { XProviderProps } from '@ant-design/x';
  import type { XProviderSlots } from './types';
  import { applyPureReactInVue } from 'veaury';
  import { useAttrs } from 'vue';
  import WrappedXProvider from './components-react/x-provider';

  interface Props extends /* @vue-ignore */ Partial<XProviderProps> {

  }

  defineOptions({ inheritAttrs: false });
  defineProps<Props>();

  const slots = defineSlots<XProviderSlots>();
  const attrs = useAttrs() as XProviderProps;

  const XProvider = applyPureReactInVue(WrappedXProvider);
</script>
