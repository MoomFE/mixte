<template>
  <div text-sm grid="~ cols-[auto_1fr] items-center gap-2">
    pkg: <el-input v-model="pkg" class="w-48!" />
    version: <el-input v-model="version" class="w-48!" />
    file: <el-input v-model="file" class="w-48!" />
    <div grid-col-span-2>
      <el-button class="c-white!" color="#14b8a6" @click="getFastestCDN(pkg, { version, file })">获取</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

  const pkg = ref('mixte');
  const version = ref<string>();
  const file = ref<string>();
</script>
