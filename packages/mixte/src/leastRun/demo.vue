<template>
  <button m-btn="~ primary" :disabled="isRun" @click="fn">
    <i-svg-spinners-ring-resize v-if="isRun" class="mr-2" />
    运行函数
  </button>

  <div grid="~ gap-2" mt-6>
    <div>
      最少执行的时间 ( 毫秒 ):
      <el-input-number v-model="ms" class="w-32!" controls-position="right" :disabled="isRun" :min="0" />
    </div>
    <div>方法运行中: <b>{{ isRun }}</b></div>
  </div>
</template>

<script lang="ts" setup>
  import { leastRun } from 'mixte';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const isRun = ref(false);
  const ms = ref(1000);

  async function fn() {
    isRun.value = true;
    await leastRun(ms.value, () => {});
    isRun.value = false;
  }

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <button @click="fn">运行函数</button>
</template>

<script lang="ts" setup>
  async function fn() {
    await leastRun(${ms.value}, () => {});
  }
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
