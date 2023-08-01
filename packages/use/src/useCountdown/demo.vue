<template>
  <div class="flex gap-2">
    <button class="w-70 h-9 box-b" :disabled="isStart" un:disabled="cursor-progress" @click="start">
      {{ isStart ? output.toFixed(0) : '点击开始倒计时' }}
    </button>
    <button v-if="isStart" class="h-9 box bg-teal-5 c-white rounded-1 p-3" @click="stop">
      停止
    </button>
  </div>

  <div class="mt-2">isStart: <b>{{ isStart }}</b></div>
  <div>output: <b>{{ output }}</b></div>
</template>

<script lang="ts" setup>
  import { useCountdown } from '@mixte/use';

  const source = ref(60);
  const duration = ref(60 * 1000);

  const { isStart, output, start, stop } = useCountdown(source, {
    duration,
  });
</script>
