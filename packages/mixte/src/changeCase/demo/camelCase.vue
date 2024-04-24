<template>
  <div text-sm grid="~ cols-[auto_1fr] items-center gap-2">
    input: <el-input v-model="input" class="w-66!" clearable placeholder="请输入" />
    output: <el-input v-model="output" class="w-66!" clearable disabled />
  </div>
</template>

<script lang="ts" setup>
  import { camelCase } from 'mixte';
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';

  interface Props {
    fn?: (str: string) => string;
    fnName?: string;
    defaultInput?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    fn: camelCase,
    fnName: 'camelCase',
    defaultInput: 'foo-bar-baz',
  });

  const input = ref<string>(props.defaultInput ?? '');
  const output = computed(() => props.fn(input.value));

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `${props.fnName}('${input.value}'); // -> '${output.value}'`),
    { direction: 'rtl' },
  );
</script>
