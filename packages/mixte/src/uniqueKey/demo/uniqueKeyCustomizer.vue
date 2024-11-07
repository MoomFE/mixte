<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <button m-btn="~ primary" @click="value = uniqueKeyCustomizer()">点击生成</button>
    <el-input :value="`${value}`" class="w-48! [&_input]-text-center" readonly />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { uniqueKeyCustomizer } from 'mixte';

  const value = ref(
    uniqueKeyCustomizer(),
  );

  inject<InjectCode>('code')!.value = 'uniqueKeyCustomizer();';
</script>
