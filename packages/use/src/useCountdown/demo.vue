<template>
  <div class="flex">
    <el-button class="w-60" type="primary" :disabled="isStart" @click="start">
      {{ isStart ? output.toFixed(0) : '点击开始倒计时' }}
    </el-button>
    <el-button v-if="isStart" type="primary" @click="stop">
      停止
    </el-button>
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
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { useCountdown } from '@mixte/use';

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
