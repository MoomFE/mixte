<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
      from: <el-input-number v-model="from" class="w-32!" controls-position="right" />
      to: <el-input-number v-model="to" class="w-32!" controls-position="right" />
    </div>
    <el-button type="primary" @click="value = random(from, to)">点击随机</el-button>
    <el-input :value="value" class="w-36!" readonly />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { random } from 'mixte';

  const from = ref(-100);
  const to = ref(100);
  const value = ref(
    random(from.value, to.value),
  );

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `random(${from.value}, ${to.value}); // -> ${value.value}`),
    { direction: 'rtl' },
  );
</script>
