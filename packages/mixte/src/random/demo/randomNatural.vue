<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
      min: <el-input-number v-model="min" class="w-32!" controls-position="right" :min="0" />
      max: <el-input-number v-model="max" class="w-32!" controls-position="right" :min="min" />
    </div>
    <el-button type="primary" @click="value = randomNatural(min, max)">点击随机</el-button>
    <el-input :value="value" class="w-36!" readonly />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { randomNatural } from 'mixte';

  const min = ref(0);
  const max = ref(100);
  const value = ref(
    randomNatural(min.value, max.value),
  );

  wheneverImmediate(() => min.value > max.value, () => {
    max.value = min.value;
  });

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `randomNatural(${min.value}, ${max.value}); // -> ${value.value}`),
    { direction: 'rtl' },
  );
</script>
