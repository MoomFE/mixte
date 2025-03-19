<template>
  <Bubble
    v-bind="bubbleProps"
  >
    <template
      v-for="(_, name) in slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot v-bind="slotProps" :key="name" :name="name" />
    </template>
  </Bubble>
</template>

<script lang="ts" setup>
  import type { BubbleProps } from '@ant-design/x';
  import type { AvatarProps } from 'antd';
  import type { defineComponent } from 'vue';
  import type { BubbleSlots } from './types';
  import { omit, transformKeys } from 'mixte';
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

    const result = omit(attrs, [...bubbleSlots]);

    bubbleSlots.forEach((key) => {
      if (!slots[key]) result[key] = attrs[key] ?? props[key];
    });

    return {
      ...props,
      ...transformKeys(result),
    };
  });
</script>
