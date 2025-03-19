<template>
  <Welcome v-bind="welcomeProps" />
</template>

<script lang="ts" setup>
  import type { WelcomeProps } from '@ant-design/x';
  import type { WelcomeSlots } from './types';
  import { transformKeys } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, onBeforeUpdate, ref, useAttrs } from 'vue';
  import WrappedWelcome from './components-react/welcome';
  import { welcomeSlots } from './types';

  interface Props extends /* @vue-ignore */ Partial<WelcomeProps> {

  }

  defineOptions({ inheritAttrs: false });
  defineProps<Props>();

  const slots = defineSlots<WelcomeSlots>();
  const attrs = useAttrs() as WelcomeProps;

  const Welcome = applyPureReactInVue(WrappedWelcome);

  /**
   * 响应式无法监听到组件插槽变化, 需要强制使响应式重新计算
   * @see https://github.com/vuejs/core/issues/11227
   */
  const hasSlots = ref(
    welcomeSlots.map(key => !!slots[key]).join(','),
  );

  onBeforeUpdate(() => {
    hasSlots.value = welcomeSlots.map(key => !!slots[key]).join(',');
  });

  const welcomeProps = computed(() => {
    hasSlots.value; // eslint-disable-line ts/no-unused-expressions

    return {
      ...transformKeys(attrs),
      ...slots,
    };
  });
</script>
