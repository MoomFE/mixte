<template>
  <div flex gap-2 items-center lt-sm:flex-col>
    <div grid="~ cols-[auto_1fr] items-center gap-1">
      from: <el-input-number v-model="from" class="w-32!" controls-position="right" />
      to: <el-input-number v-model="to" class="w-32!" controls-position="right" />
    </div>
    <button m-btn @click="value = random(from, to)">点击随机</button>
    <el-input v-model="value" class="w-36!" readonly />
  </div>
</template>

<script setup>
  import { random } from 'mixte';

  const from = ref(-100);
  const to = ref(100);
  const value = ref(
    random(from.value, to.value),
  );
</script>
