<template>
  <Bubble v-bind="bubbleProps" />
</template>

<script lang="ts" setup>
  import type { BubbleProps } from '@ant-design/x';
  import type { AvatarProps } from 'antd';
  import type { defineComponent } from 'vue';
  import type { BubbleSlots } from './types';
  import { transformKeys } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, onBeforeUpdate, ref, useAttrs } from 'vue';
  import WrappedBubble from './components-react/bubble';
  import { bubbleSlots } from './types';

  interface AntAvatarProps extends Omit<AvatarProps, 'icon'> {
    icon?: ReturnType<typeof defineComponent>;
  }

  interface Props extends /* @vue-ignore */ Partial<Omit<BubbleProps, 'avatar'>> {
    avatar?: AntAvatarProps;
  }

  defineOptions({ inheritAttrs: false });

  const props = defineProps<Props>();
  const slots = defineSlots<BubbleSlots>();

  const attrs = useAttrs();

  const Bubble = applyPureReactInVue(WrappedBubble);

  /**
   * 响应式无法监听到组件插槽变化, 需要强制使响应式重新计算
   * @see https://github.com/vuejs/core/issues/11227
   */
  const hasSlots = ref(
    bubbleSlots.map(key => !!slots[key]).join(','),
  );

  onBeforeUpdate(() => {
    hasSlots.value = bubbleSlots.map(key => !!slots[key]).join(',');
  });

  const bubbleProps = computed(() => {
    hasSlots.value; // eslint-disable-line ts/no-unused-expressions

    return {
      ...props,
      ...transformKeys(attrs),
      ...slots,
    };
  });
</script>
