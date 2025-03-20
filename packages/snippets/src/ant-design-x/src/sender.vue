<template>
  <Sender
    v-bind="senderProps"
    :value
    @change="proxyOnChange"
  />
</template>

<script lang="ts" setup>
  import type { SenderProps } from '@ant-design/x';
  import { Sender as XSender } from '@ant-design/x';
  import { omit, transformKeys } from 'mixte';
  import { applyPureReactInVue, injectSyncUpdateForPureReactInVue } from 'veaury';
  import { computed, useAttrs } from 'vue';

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
  const attrs = useAttrs() as SenderProps;

  const value = defineModel<string>('modelValue', {
    default: '',
  });

  injectSyncUpdateForPureReactInVue(XSender, {
    onChange: (value: string) => ({ value }),
  });

  const Sender = applyPureReactInVue(XSender);

  const senderProps = computed(() => {
    return {
      ...props,
      ...transformKeys(omit(attrs, ['value', 'onChange'])),
    };
  });

  const proxyOnChange: SenderProps['onChange'] = (...args: Parameters<NonNullable<SenderProps['onChange']>>) => {
    value.value = args[0];
    attrs.onChange?.(...args);
  };
</script>
