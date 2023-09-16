<template>
  <div flex="~ col gap-2">
    <input v-model="url" w-66 m-input>
    <div flex="~ items-center gap-2">
      <el-button class="c-white!" color="#14b8a6" :loading="isLoading" @click="execute">请求</el-button>
      <span c-gray>
        ← <i text-xs>点击发起请求</i>
      </span>
    </div>
    <div class="rounded bg-gray/10">
      <pre scrollbar my-0 p="y1 x3">{{ responseParsed }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { omit } from 'lodash-es';
  import axios from 'axios';
  import yaml from 'js-yaml';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const url = ref('https://httpbin.org/uuid');

  const {
    response, data, error,
    isExecuted, isLoading, isFinished, isSuccess,
    execute,
  } = useRequest(() => {
    return axios.get(url.value).then(res => omit(res, 'config'));
  }, {
    immediate: true,
  });

  const responseParsed = computed(() => {
    return yaml.dump(
      readonly({
        isExecuted,
        isLoading,
        isFinished,
        isSuccess,
        response: computed(() => response.value ?? `${response.value}`),
        data: computed(() => data.value ?? `${data.value}`),
        error: computed(() => (error.value && error.value.message) ?? `${error.value}`),
      }),
      { skipInvalid: true, condenseFlow: true, noCompatMode: true },
    );
  });

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <el-button :loading="isLoading" @click="execute">请求</el-button>
</template>

<script lang="ts" setup>
  const {
    response, data, error,
    isExecuted, isLoading, isFinished, isSuccess,
    execute
  } = useRequest(() => axios.get('${url.value}'), {
    immediate: true,
  });
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
