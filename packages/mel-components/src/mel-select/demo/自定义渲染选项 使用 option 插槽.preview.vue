<template>
  <div flex items-center gap-2>
    <MelSelect
      v-model="value"
      :options="options"
      style="width: 240px"
    >
      <template #option="{ label, value }">
        <ElOption :value="value">
          <span>{{ label }}</span>
          <small class="c-red ml-2">( 通过 option 插槽实现的自定义渲染选项 )</small>
        </ElOption>
      </template>
    </MelSelect>
    <div v-if="value">value: {{ value }}</div>
  </div>
</template>

<script lang="tsx" setup>
  import type { MelSelectProps } from '@mixte/mel-components/mel-select';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import { ElOption } from 'element-plus';
  import 'element-plus/es/components/select/style/index';

  const value = ref<string>();

  const options: MelSelectProps['options'] = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    {
      label: '选项3',
      value: '3',
      render: (option) => {
        return (
          <ElOption value={option.value}>
            <span>{option.label}</span>
            <small class="c-red ml-2">( 通过 render 实现的自定义渲染选项, 优先级比 option 插槽高 )</small>
          </ElOption>
        );
      },
    },
  ];
</script>
