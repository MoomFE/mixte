<template>
  <Render />
</template>

<script lang="tsx" setup>
  import type { ISelectProps } from 'element-plus';
  import type { Ref } from 'vue';
  import type { MelSelectProps, MelSelectSlots, SelectInstance } from './types';
  import { useOptionsApi } from '@mixte/mel-components/utils';
  import { ElOption, ElSelect } from 'element-plus';
  import { computed, ref, toRef, useAttrs } from 'vue';

  const props = defineProps<MelSelectProps>();
  const slots = defineSlots<MelSelectSlots>();
  const attrs = useAttrs();

  const value = defineModel<ISelectProps['modelValue']>('modelValue');

  const selectRef = ref<SelectInstance>();

  const { propApi, api, loading } = useOptionsApi(toRef(props, 'optionsApi'));

  const options = computed(() => {
    return (propApi.value ? api.response : props.options);
  });

  function Render() {
    return (
      <ElSelect
        {...attrs}
        ref={selectRef}
        v-model={value.value}
        loading={props.loading || loading.value}
      >
        {{
          default: () => {
            return options.value?.map((option) => {
              // 优先使用选项的 render 函数
              if (option.render) return option.render(option);
              // 其次使用 option 插槽
              if (slots.option) return slots.option(option);

              return (
                <ElOption key={`${option.value}`} {...option}>
                  {(slots['option-label'] ?? slots['all-label'])?.(option)}
                </ElOption>
              );
            });
          },
          ...slots,
          label: slots.label ?? slots['all-label'],
        }}
      </ElSelect>
    );
  }

  defineExpose({
    selectRef: selectRef as Ref<SelectInstance | undefined>,
    api,
  });
</script>
