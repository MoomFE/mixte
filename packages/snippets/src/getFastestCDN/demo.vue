<template>
  <div text-sm grid="~ cols-[auto_1fr] items-center gap-2">
    pkg: <el-input v-model="pkg" class="w-48!" clearable />
    version: <el-input v-model="version" class="w-48!" clearable />
    file: <el-input v-model="file" class="w-66!" clearable />
    <div grid-col-span-2 flex="~ wrap items-center gap-2">
      <el-button class="c-white!" color="#14b8a6" :loading="CDN.isLoading" @click="CDN.execute()">获取</el-button>
      <span c-gray>
        ← <i text-xs>点击获取当前环境下最快的 CDN 服务</i>
      </span>
    </div>
    <div v-if="CDN.isSuccess" class="grid-col-span-2 rounded bg-gray/10 p2">
      {{ CDN.response }}
    </div>
    <el-alert v-else-if="CDN.error" class="grid-col-span-2" type="error" :title="CDN.error" :closable="false" />
  </div>
</template>

<script lang="ts" setup>
  import { randomNatural } from 'mixte';
  import { useRequestReactive } from '@mixte/use';
  import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

  const pkg = ref('');
  const version = ref('');
  const file = ref('');

  const examplePkg = [
    { pkg: 'mixte' },
    { pkg: 'shiki', version: '0.14.5', file: '/languages/html.tmLanguage.json' },
    { pkg: 'monaco-editor', version: '0.43.0', file: '/min/vs/basic-languages/yaml/yaml.js' },
  ];

  const CDN = useRequestReactive(() => {
    return getFastestCDN(pkg.value, {
      version: version.value,
      file: file.value,
    });
  });

  onMounted(() => {
    const example = examplePkg[randomNatural(0, examplePkg.length - 1)];

    pkg.value = example.pkg;
    version.value = example.version ?? '';
    file.value = example.file ?? '';
  });
</script>
