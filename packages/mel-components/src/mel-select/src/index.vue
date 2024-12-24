<template>
  <Render />
</template>

<script lang="tsx" setup>
  import type { ISelectProps } from 'element-plus';
  import type { MelSelectExpose, MelSelectProps, MelSelectSlots, SelectInstance } from './types';
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
              return <ElOption key={`${option.value}`} {...option} />;
            });
          },
          ...slots,
        }}
      </ElSelect>
    );
  }

  defineExpose<MelSelectExpose>(
    // @ts-expect-error
    new Proxy({ selectRef, api }, {
      get(target, key) {
        return Reflect.get(target, key) ?? Reflect.get(selectRef.value ?? {}, key);
      },
      has(target, key) {
        return Reflect.has(target, key) || Reflect.has(selectRef.value ?? {}, key);
      },
    }),
  );
</script>
