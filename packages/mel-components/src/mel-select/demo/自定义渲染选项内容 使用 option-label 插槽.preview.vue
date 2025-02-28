<template>
  <div flex items-center gap-2>
    <MelSelect
      v-model="value"
      :options="options"
      style="width: 240px"
    >
      <template #option-label="{ label }">
        <span>{{ label }}</span>
        <small class="c-red ml-2">( 通过 option-label 插槽实现的自定义渲染选项内容 )</small>
      </template>
    </MelSelect>
    <div v-if="value">value: {{ value }}</div>
  </div>
</template>

<script lang="tsx" setup>
  import type { MelSelectProps } from '@mixte/mel-components/mel-select';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import 'element-plus/es/components/select/style/index';

  const value = ref<string>();

  const options: MelSelectProps['options'] = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ];
</script>
