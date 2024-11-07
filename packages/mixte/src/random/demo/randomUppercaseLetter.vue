<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <button m-btn="~ primary" @click="value = randomUppercaseLetter()">点击随机</button>
    <el-input :value="value" class="w-36! [&_input]-text-center" readonly />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { randomUppercaseLetter } from 'mixte';

  const value = ref(
    randomUppercaseLetter(),
  );

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `randomUppercaseLetter(); // -> ${value.value}`),
    { direction: 'rtl' },
  );
</script>
