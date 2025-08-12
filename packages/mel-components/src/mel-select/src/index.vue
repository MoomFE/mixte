<template>
  <component
    :is="h(
      ElSelect,
      {
        ...attrs,
        loading: props.loading || loading,
      },
      {
        default: defaultSlot,
        ...slots,
        label: slots.label ?? slots['all-label'],
      },
    )"
  />
</template>

<script lang="tsx" setup>
  import type { Ref } from 'vue';
  import type { MelSelectProps, MelSelectSlots, SelectInstance } from './types';
  import { useOptionsApi } from '@mixte/mel-components/utils';
  import { ElOption, ElSelect } from 'element-plus';
  import { computed, h, ref, toRef, useAttrs } from 'vue';

  const props = defineProps<MelSelectProps>();
  const slots = defineSlots<MelSelectSlots>();
  const attrs = useAttrs();

  const selectRef = ref<SelectInstance>();

  const { propApi, api, loading } = useOptionsApi(toRef(props, 'optionsApi'));

  const options = computed(() => {
    return (propApi.value ? api.response : props.options);
  });

  function defaultSlot() {
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
  }

  defineExpose({
    selectRef: selectRef as Ref<SelectInstance | undefined>,
    options,
    api,
  });
</script>
