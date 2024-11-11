<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <el-radio-group v-model="uppercase" class="[&_.el-radio]-mr-0 mr-3" flex="col items-start!">
      <el-radio :value="undefined">大写或小写</el-radio>
      <el-radio :value="true">大写</el-radio>
      <el-radio :value="false">小写</el-radio>
    </el-radio-group>
    <el-button type="primary" @click="setValue">点击随机</el-button>
    <el-input :value="value" class="w-36! [&_input]-text-center" readonly />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { randomLetter } from 'mixte';

  const uppercase = ref<boolean>();
  const value = ref(
    randomLetter(),
  );

  function setValue() {
    value.value = randomLetter(uppercase.value);
  }

  watchImmediate(uppercase, setValue);

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `randomLetter(${uppercase.value === undefined ? '' : uppercase.value}); // -> ${value.value}`),
    { direction: 'rtl' },
  );
</script>
