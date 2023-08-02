<template>
  <div class="flex gap-2">
    <button class="w-60 h-9 m-box bg-teal-5 c-white" :disabled="isStart" un:disabled="cursor-progress" @click="start">
      {{ isStart ? output.toFixed(0) : '点击开始倒计时' }}
    </button>
    <button v-if="isStart" class="h-9 m-box bg-teal-5 c-white rounded-1 p-3" @click="stop">
      停止
    </button>
  </div>

  <div grid="~ gap-2" mt-6>
    <div>
      倒计时数字:
      <input v-model="source" type="number" w-30 lh-none b="1 solid neutral-3 rounded-1" p="2 x-3">
    </div>
    <div>
      倒计时所使用的时间 ( 毫秒 ):
      <input v-model="duration" type="number" w-30 lh-none b="1 solid neutral-3 rounded-1" p="2 x-3">
    </div>
    <div>isStart: <b>{{ isStart }}</b></div>
    <div>output: <b>{{ output }}</b></div>
  </div>
</template>

<script lang="ts" setup>
  import { useCountdown } from '@mixte/use';

  const source = ref(60);
  const duration = ref(60 * 1000);

  const { output, isStart, start, stop } = useCountdown(source, {
    duration,
  });
</script>
