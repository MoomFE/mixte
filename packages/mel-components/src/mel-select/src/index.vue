<template>
  <Render />
</template>

<script lang="tsx" setup>
  import type { ISelectProps } from 'element-plus';
  import type { MelSelectProps, MelSelectSlots, SelectInstance } from './types';
  import { ElOption, ElSelect } from 'element-plus';
  import { ref, type Ref, useAttrs } from 'vue';

  const props = defineProps<MelSelectProps>();
  const slots = defineSlots<MelSelectSlots>();
  const attrs = useAttrs();

  const value = defineModel<ISelectProps['modelValue']>('modelValue');

  const selectRef = ref<SelectInstance>();

  function Render() {
    return (
      <ElSelect
        {...attrs}
        ref={selectRef}
        v-model={value.value}
      >
        {{
          default: () => {
            return props.options?.map((option) => {
              return <ElOption key={`${option.value}`} {...option} />;
            });
          },
          ...slots,
        }}
      </ElSelect>
    );
  }

  defineExpose<{
    selectRef: Ref<SelectInstance | undefined>;
  }>({
    selectRef,
  });
</script>
