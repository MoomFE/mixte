<template>
  <component
    :is="h(
      ElSelect,
      {
        ...attrs,
        ref: changeRef as VNodeRef,
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
  import type { ComponentPublicInstance, Ref, VNodeRef } from 'vue';
  import type { ComponentExposed } from 'vue-component-type-helpers';
  import type { MelSelectProps, MelSelectSlots, SelectInstance } from './types';
  import { useOptionsApi } from '@mixte/mel-components/utils';
  import { ElOption, ElSelect } from 'element-plus';
  import { computed, getCurrentInstance, h, toRef, useAttrs } from 'vue';

  const props = defineProps<MelSelectProps>();
  const slots = defineSlots<MelSelectSlots>();
  const attrs = useAttrs();

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

  defineExpose<
    ComponentExposed<typeof ElSelect> & {
      selectRef: Ref<SelectInstance | undefined>;
      api: ReturnType<typeof useOptionsApi>['api'];
    }
  >();

  const vm = getCurrentInstance()!;

  function changeRef(selectInstance: ComponentPublicInstance) {
    const exposed = new Proxy({ api, selectRef: selectInstance }, {
      get(target, key) {
        return Reflect.get(target, key) ?? Reflect.get(selectInstance ?? {}, key);
      },
      has(target, key) {
        return Reflect.has(target, key) || Reflect.has(selectInstance ?? {}, key);
      },
    });

    vm.exposed = vm.exposeProxy = exposed;
  }
</script>
