<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <button m-btn="~ primary" @click="value = randomBoolean()">点击随机</button>
    <el-input :value="`${value}`" class="w-36! [&_input]-text-center" readonly />
  </div>
</template>

<script lang="ts" setup>
  import { randomBoolean } from 'mixte';
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';

  const value = ref(
    randomBoolean(),
  );

  inject<InjectCode>('code')!.value = 'randomBoolean();';
</script>
