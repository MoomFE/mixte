<template>
  <div grid="~ cols-[auto_1fr] items-center gap-2" text-sm space-y-2>
    <div text-right>input:</div>
    <el-input v-model="inputText" type="textarea" :rows="6" clearable placeholder="请输入 JSON 对象" />

    <div text-right>转换方法:</div>
    <el-select v-model="selectedMethod" class="w-66!">
      <el-option v-for="method in methods" :key="method.name" :label="method.name" :value="method.name" />
    </el-select>

    <div text-right>output:</div>
    <el-input v-model="output" type="textarea" :rows="6" disabled />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { camelCase, kebabCase, pascalCase, snakeCase, transformKeys } from 'mixte';

  const methods = [
    { name: 'camelCase', fn: camelCase },
    { name: 'pascalCase', fn: pascalCase },
    { name: 'kebabCase', fn: kebabCase },
    { name: 'snakeCase', fn: snakeCase },
  ];

  const selectedMethod = ref('camelCase');
  const inputText = ref(`{ "foo-bar": 1, "baz_qux": 2 }`);

  const currentMethod = computed(() => {
    return methods.find(m => m.name === selectedMethod.value)?.fn || camelCase;
  });

  const parsedInput = computed(() => {
    try {
      return JSON.parse(inputText.value);
    }
    catch {
      return {};
    }
  });

  const transformedOutput = computed(() => {
    try {
      return transformKeys(parsedInput.value, currentMethod.value);
    }
    catch {
      return {};
    }
  });

  const output = computed(() => {
    return JSON.stringify(transformedOutput.value, null, 2);
  });

  syncRef(
    inject<InjectCode>('code')!,
    computed(() =>
      `transformKeys(${inputText.value}, ${selectedMethod.value}); // -> ${JSON.stringify(transformedOutput.value)}`,
    ),
    { direction: 'rtl' },
  );
</script>
