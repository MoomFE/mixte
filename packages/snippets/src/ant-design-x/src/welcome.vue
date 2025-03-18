<template>
  <Welcome
    v-bind="welcomeProps"
  >
    <template
      v-for="(_, name) in slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot v-bind="slotProps" :key="name" :name="name" />
    </template>
  </Welcome>
</template>

<script lang="ts" setup>
  import type { WelcomeProps } from '@ant-design/x';
  import { omit } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, onBeforeUpdate, ref, useAttrs } from 'vue';
  import WrappedWelcome from './components-react/Welcome';
  import { type WelcomeSlots, welcomeSlots } from './types';

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

    const result = omit(attrs, welcomeSlots);

    welcomeSlots.forEach((key) => { // @ts-expect-error
      if (!slots[key]) result[key] = attrs[key];
    });

    return result;
  });
</script>
