<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <button m-btn="~ primary" @click="value = randomLowercaseLetter()">点击随机</button>
    <el-input :value="value" class="w-36! [&_input]-text-center" readonly />
  </div>
</template>

<script lang="ts" setup>
  import { randomLowercaseLetter } from 'mixte';
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';

  const value = ref(
    randomLowercaseLetter(),
  );

  inject<InjectCode>('code')!.value = 'randomLowercaseLetter();';
</script>
