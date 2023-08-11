<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <button m-btn="~ primary" @click="value = randomUppercaseLetter()">点击随机</button>
    <el-input :value="value" class="w-36! [&_input]-text-center" readonly />
  </div>
</template>

<script setup>
  import { randomUppercaseLetter } from 'mixte';

  const value = ref(
    randomUppercaseLetter(),
  );
</script>
