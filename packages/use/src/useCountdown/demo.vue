<template>
  <div class="flex gap-2">
    <button class="w-60" m-btn="~ primary" :disabled="isStart" @click="start">
      {{ isStart ? output.toFixed(0) : '点击开始倒计时' }}
    </button>
    <button v-if="isStart" m-btn="~ primary" @click="stop">
      停止
    </button>
  </div>

  <div grid="~ gap-2" mt-6>
    <div>
      倒计时数字:
      <input v-model="source" type="number" w-30 m-input>
    </div>
    <div>
      倒计时所使用的时间 ( 毫秒 ):
      <input v-model="duration" type="number" w-30 m-input>
    </div>
    <div>isStart: <b>{{ isStart }}</b></div>
    <div>output: <b>{{ output }}</b></div>
  </div>
</template>

<script lang="ts" setup>
  import { useCountdown } from '@mixte/use';
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';

  const source = ref(60);
  const duration = ref(60 * 1000);

  const { output, isStart, start, stop } = useCountdown(source, {
    duration,
  });

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
const source = ref(${source.value});
const duration = ref(${duration.value});

const {
  output, // -> ${output.value}
  isStart, // -> ${isStart.value}
  start, stop
} = useCountdown(source, {
  duration,
});
    `),
    { direction: 'rtl' },
  );
</script>
