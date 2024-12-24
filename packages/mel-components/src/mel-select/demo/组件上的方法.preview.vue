<template>
  <div flex items-center gap-2>
    <MelSelect
      ref="selectRef"
      v-model="value"
      :options="options"
      style="width: 240px"
    />
    <div v-if="value">value: {{ value }}</div>
  </div>

  <div mt-2>
    <el-button type="primary" @click="focusThenBlur">聚焦，一秒后失焦</el-button>
  </div>
</template>

<script lang="ts" setup>
  import type { MelSelectInstance } from '@mixte/mel-components/mel-select';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import { delay } from 'mixte';
  import 'element-plus/es/components/select/style/index';

  const value = ref<string>();

  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ];

  const selectRef = ref<MelSelectInstance>();

  async function focusThenBlur() {
    selectRef.value?.focus();
    await delay(1000);
    selectRef.value?.blur();
  }
</script>
