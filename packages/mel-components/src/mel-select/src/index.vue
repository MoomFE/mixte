<template>
  <component
    :is="h(
      ElSelect,
      {
        ...attrs,
        loading: props.loading || loading,
        filterable,
        filterMethod: remote ? undefined : filterMethod,
        remote,
        remoteMethod,
      },
      {
        default: DefaultSlot,
        ...slots,
        label: slots.label ?? slots['all-label'],
      },
    )"
  />
</template>

<script lang="tsx" setup>
  import type { Ref } from 'vue';
  import type { MelSelectOption, MelSelectProps, MelSelectSlots, SelectInstance } from './types';
  import { useOptionsApi } from '@mixte/mel-components/utils';
  import { ElOption, ElSelect } from 'element-plus';
  import { isFunction } from 'mixte';
  import { computed, h, ref, toRef, toValue, useAttrs } from 'vue';

  const props = defineProps<MelSelectProps>();
  const slots = defineSlots<MelSelectSlots>();
  const attrs = useAttrs();

  const selectRef = ref<SelectInstance>();

  const remoteFilterValue = ref('');

  const { propApi, api, loading } = useOptionsApi(toRef(props, 'optionsApi'), {
    params: () => {
      if (!props.filterable || !props.remote || isFunction(props.optionsApi) || !props.optionsApi?.remoteKey) return undefined;
      return {
        [props.optionsApi.remoteKey]: remoteFilterValue.value,
      };
    },
  });

  const filterValue = ref('');
  const filterOptionMethod = computed(() => isFunction(props.filterOptionMethod) ? props.filterOptionMethod : undefined);

  const propOptions = computed(() => toValue(props.options));

  const options = computed(() => {
    const options = (propApi.value ? api.response : propOptions.value);

    if (filterOptionMethod.value) {
      return options?.filter(option => filterOptionMethod.value!(filterValue.value, option));
    }
    else if (props.filterable) {
      return options?.filter(option => `${option.label}`.toLowerCase().includes(filterValue.value.toLowerCase()));
    }

    return options;
  });

  function filterMethod(query: string) {
    filterValue.value = query;
  }

  function remoteMethod(query: string) {
    remoteFilterValue.value = query;
  }

  /**
   * 在当前组件的渲染上下文内包装一次对 slots.option 的调用
   *  - 避免 Vue 的警告: `Slot "option" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
   */
  function OptionSlot(option: MelSelectOption) {
    return slots.option?.(option);
  }

  function DefaultSlot() {
    return options.value?.map((option) => {
      // 优先使用选项的 render 函数
      if (option.render) return option.render(option);
      // 其次使用 option 插槽
      if (slots.option) return <OptionSlot {...option} />;

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
