<template>
  <div flex items-center gap-2>
    <MelSelect
      v-model="value"
      :options="options"
      style="width: 240px"
    />
    <div v-if="value">value: {{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import 'element-plus/es/components/select/style/index';

  const value = ref<string>();

  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ];
</script>
