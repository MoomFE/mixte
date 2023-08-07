<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <div grid="~ cols-[auto_1fr] items-center gap-1">
      min: <el-input-number v-model="min" class="w-32!" controls-position="right" :min="0" />
      max: <el-input-number v-model="max" class="w-32!" controls-position="right" :min="min" />
    </div>
    <button m-btn @click="value = randomNatural(min, max)">点击随机</button>
    <el-input v-model="value" class="w-36!" readonly />
  </div>
</template>

<script setup>
  import { randomNatural } from 'mixte';

  const min = ref(0);
  const max = ref(100);
  const value = ref(
    randomNatural(min.value, max.value),
  );

  wheneverImmediate(() => min.value > max.value, () => {
    max.value = min.value;
  });
</script>
