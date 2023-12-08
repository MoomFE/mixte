<template>
  <div text-sm grid="~ cols-[auto_1fr] items-center gap-2">
    pkg:
    <div flex="~ items-center gap-2">
      <el-input v-model="pkg" class="w-48!" clearable />
      <button @click="next()">
        <i-fe-random class="size-5" />
      </button>
    </div>
    version: <el-input v-model="version" class="w-48!" clearable />
    file: <el-input v-model="file" class="w-66!" clearable />
    <div grid-col-span-2 flex="~ wrap items-center gap-2">
      <el-button class="c-white!" color="#14b8a6" :disabled="!pkg" :loading="CDN.isLoading" @click="CDN.execute()">获取</el-button>
      <span c-gray>
        ← <i text-xs>点击获取</i>
      </span>
    </div>
    <div v-if="CDN.isSuccess" class="grid-col-span-2 rounded bg-gray/10 p2">
      {{ CDN.response }}
    </div>
    <el-alert v-else-if="CDN.error" class="grid-col-span-2" type="error" :title="CDN.error" :closable="false" />
  </div>
</template>

<script lang="ts" setup>
  import { useRequestReactive } from '@mixte/use';
  import { getFastestCDN } from '@mixte/snippets/getFastestCDN';
  import { randomNatural } from 'mixte';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const pkg = ref('');
  const version = ref('');
  const file = ref('');

  const CDN = useRequestReactive(() => {
    return getFastestCDN(pkg.value, {
      version: version.value,
      file: file.value,
    });
  });

  const { state, next, index } = useCycleList([
    { pkg: 'mixte' },
    { pkg: 'shiki', version: '0.14.5', file: '/languages/html.tmLanguage.json' },
    { pkg: 'monaco-editor', version: '0.43.0', file: '/min/vs/basic-languages/yaml/yaml.js' },
  ]);

  next(randomNatural(0, 2));

  watchImmediate(index, () => {
    pkg.value = state.value.pkg;
    version.value = state.value.version ?? '';
    file.value = state.value.file ?? '';

    if (CDN.successCount) CDN.execute();
  });

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <el-button @click="onClick">获取</el-button>
</template>

<script lang="ts" setup>
  import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

  function onClick() {
    getFastestCDN('${pkg.value}'${
      (version.value || file.value)
        ? `, {\n      ${[version.value ? `version: '${version.value}'` : '', file.value ? `file: '${file.value}'` : ''].filter(v => !!v).join(',\n      ')}\n    }`
        : ''
    });
  }
<\/script>
    `),
  );
</script>

<!-- , {
  version: '${version.value}',
  file: '${file.value}'
} -->
