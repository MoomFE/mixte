<template>
  <button m-btn="~ primary" @click="fn">
    运行函数
  </button>

  <div grid="~ gap-2" mt-6>
    <div>方法运行中: <b>{{ isRun }}</b></div>
    <div>方法运行次数: <b>{{ runCount }}</b></div>
  </div>
</template>

<script lang="ts" setup>
  import { delay, onceRun } from 'mixte';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const isRun = ref(false);
  const runCount = ref(0);

  const fn = onceRun(async () => {
    runCount.value++;
    isRun.value = true;
    await delay(2400);
    isRun.value = false;
  });

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <button @click="fn">运行函数</button>
</template>

<script lang="ts" setup>
  const isRun = ref(${isRun.value});
  const runCount = ref(${runCount.value});

  const fn = onceRun(async () => {
    runCount.value++;
    isRun.value = true;
    await delay(2400);${isRun.value ? ' // -> 方法运行中' : ''}
    isRun.value = false;
  });
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
