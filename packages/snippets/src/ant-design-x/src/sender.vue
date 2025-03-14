<template>
  <Sender
    v-bind="omit(attrs, ['value', 'onChange'])"
    :value
    @change="proxyOnChange"
  />
</template>

<script lang="ts" setup>
  import type { SenderProps } from '@ant-design/x';
  import { Sender as XSender } from '@ant-design/x';
  import { omit } from 'lodash-es';
  import { applyPureReactInVue } from 'veaury';
  import { useAttrs } from 'vue';

  interface Props extends /* @vue-ignore */ Partial<Omit<SenderProps, 'value'>> {

  }

  defineOptions({ inheritAttrs: false });
  defineProps<Props>();

  const attrs = useAttrs() as SenderProps;

  const value = defineModel<string>('modelValue', {
    default: '',
  });

  const Sender = applyPureReactInVue(XSender);

  const proxyOnChange: SenderProps['onChange'] = (...args: Parameters<NonNullable<SenderProps['onChange']>>) => {
    value.value = args[0];
    attrs.onChange?.(...args);
  };
</script>
