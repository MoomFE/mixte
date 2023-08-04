<template>
  <div flex flex-col gap-2 items-center>
    <el-input v-model="value" class="w-36! [&_input]-text-center" readonly />
    <button m-btn @click="value = randomLowercaseLetter()">点击随机</button>
  </div>
</template>

<script setup>
  import { randomLowercaseLetter } from 'mixte';

  const value = ref(
    randomLowercaseLetter(),
  );
</script>
