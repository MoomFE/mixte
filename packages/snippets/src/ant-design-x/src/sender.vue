<template>
  <Sender
    v-bind="senderProps"
    :value
    @change="proxyOnChange"
  />
</template>

<script lang="ts" setup>
  import type { SenderProps } from '@ant-design/x';
  import { omit, transformKeys } from 'mixte';
  import { applyPureReactInVue, injectSyncUpdateForPureReactInVue } from 'veaury';
  import { computed, onBeforeUpdate, ref, useAttrs } from 'vue';
  import WrappedSender from './components-react/sender';
  import { senderSlots, type SenderSlots } from './types';

  interface Props extends /* @vue-ignore */ Partial<
    Omit<SenderProps, 'value' | 'allowSpeech' | 'disabled' | 'loading' | 'readOnly'>
  > {
    /** 是否允许语音输入 */
    allowSpeech?: boolean | SenderProps['allowSpeech'];
    /** 是否禁用 */
    disabled?: boolean | SenderProps['disabled'];
    /** 是否加载中 */
    loading?: boolean | SenderProps['loading'];
    /** 是否让输入框只读 */
    readOnly?: boolean | SenderProps['readOnly'];
  }

  defineOptions({ inheritAttrs: false });

  const props = defineProps<Props>();
  const slots = defineSlots<SenderSlots>();
  const attrs = useAttrs() as SenderProps;

  const value = defineModel<string>('modelValue', {
    default: '',
  });

  injectSyncUpdateForPureReactInVue(WrappedSender, {
    onChange: (value: string) => ({ value }),
  });

  const Sender = applyPureReactInVue(WrappedSender);

  /**
   * 响应式无法监听到组件插槽变化, 需要强制使响应式重新计算
   * @see https://github.com/vuejs/core/issues/11227
   */
  const hasSlots = ref(
    senderSlots.map(key => !!slots[key]).join(','),
  );

  onBeforeUpdate(() => {
    hasSlots.value = senderSlots.map(key => !!slots[key]).join(',');
  });

  const senderProps = computed(() => {
    hasSlots.value; // eslint-disable-line ts/no-unused-expressions

    return {
      ...props,
      ...transformKeys(omit(attrs, ['value', 'onChange'])),
      ...slots,
    };
  });

  const proxyOnChange: SenderProps['onChange'] = (...args: Parameters<NonNullable<SenderProps['onChange']>>) => {
    value.value = args[0];
    attrs.onChange?.(...args);
  };
</script>
