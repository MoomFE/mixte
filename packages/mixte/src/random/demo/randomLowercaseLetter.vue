<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <button m-btn @click="value = randomLowercaseLetter()">点击随机</button>
    <el-input v-model="value" class="w-36! [&_input]-text-center" readonly />
  </div>
</template>

<script setup>
  import { randomLowercaseLetter } from 'mixte';

  const value = ref(
    randomLowercaseLetter(),
  );
</script>
