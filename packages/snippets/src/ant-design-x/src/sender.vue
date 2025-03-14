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
  import { omit } from 'mixte';
  import { applyPureReactInVue } from 'veaury';
  import { computed, useAttrs } from 'vue';

  interface Props extends /* @vue-ignore */ Partial<Omit<SenderProps, 'value'>> {

  }

  defineOptions({ inheritAttrs: false });
  defineProps<Props>();

  const attrs = useAttrs() as SenderProps;

  const value = defineModel<string>('modelValue', {
    default: '',
  });

  const Sender = applyPureReactInVue(XSender);

  const senderProps = computed(() => {
    return omit(attrs, ['value', 'onChange']);
  });

  const proxyOnChange: SenderProps['onChange'] = (...args: Parameters<NonNullable<SenderProps['onChange']>>) => {
    value.value = args[0];
    attrs.onChange?.(...args);
  };
</script>
