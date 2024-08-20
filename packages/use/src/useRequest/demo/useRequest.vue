<template>
  <div flex="~ col gap-2">
    <input v-model="url" w-66 m-input>
    <div flex="~ wrap items-center gap-2">
      <el-button class="c-white!" color="#14b8a6" :loading="isLoading" @click="execute">请求</el-button>
      <span c-gray>
        ← <i text-xs>点击发起请求</i>
      </span>
      <div flex="~ grow justify-end">
        <el-checkbox v-model="resetOnExecute" size="small">是否在发起请求时重置数据</el-checkbox>
      </div>
    </div>
    <div class="rounded bg-gray/10 relative">
      <ResponseParsed />
      <el-tooltip content="重置请求到初始状态" :effect="isDark ? 'light' : 'dark'">
        <el-button class="absolute top-2 right-2" type="warning" size="small" @click="reset">重置</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { useData } from 'vitepress';
  import { omit } from 'lodash-es';
  import axios from 'axios';
  import yaml from 'js-yaml';
  import { isPlainObject } from 'mixte';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const { isDark } = useData();

  const url = ref('https://httpbin.org/uuid');

  const resetOnExecute = ref(true);

  const {
    response,
    data,
    error,
    isExecuted,
    isLoading,
    isFinished,
    isSuccess,
    execute,
    reset,
  } = useRequest(() => {
    return axios.get(url.value).then(res => omit(res, 'config'));
  }, {
    immediate: true,
    resetOnExecute,
  });

  function yamlDump(obj: any) {
    return yaml.dump(
      isPlainObject(obj) ? readonly(obj) : obj,
      { skipInvalid: true, condenseFlow: true, noCompatMode: true },
    );
  }

  function ResponseParsed() {
    return (
      <pre class="scrollbar my-0 p-(y1 x3)">
        {yamlDump({ isExecuted, isLoading, isFinished, isSuccess })}
        {yamlDump({
          response: computed(() => response.value ?? `${response.value}`),
          data: computed(() => data.value ?? `${data.value}`),
          error: computed(() => (error.value && error.value.message) ?? `${error.value}`),
        })}
      </pre>
    );
  }

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <el-button :loading="isLoading" @click="execute">请求</el-button>
  <el-button @click="reset">重置</el-button>
</template>

<script lang="ts" setup>
  const {
    response, data, error,
    isExecuted, isLoading, isFinished, isSuccess,
    execute, reset,
  } = useRequest(() => axios.get('${url.value}'), {
    immediate: true,${
      resetOnExecute.value ? '' : '\n    resetOnExecute: false,'
    }
  });
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
