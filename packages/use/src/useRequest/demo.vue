<template>
  <div flex="~ col gap-2">
    <input v-model="url" w-66 m-input>
    <div flex="~ items-center gap-2">
      <el-button class="c-white!" color="#14b8a6" :loading="isLoading" @click="execute">请求</el-button>
      <span c-gray>
        ← <i text-xs>点击发起请求</i>
      </span>
    </div>
    <div class="bg-gray/10" rounded overflow-x-auto p="y1 x3">
      <pre my-0>{{ responseParsed }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import yaml from 'js-yaml';

  const url = ref('https://httpbin.org/get');

  const {
    response, data, error,
    isExecuted, isLoading, isFinished, isSuccess,
    execute,
  } = useRequest(() => {
    return fetch(url.value).then(async (res) => {
      try {
        return res.json();
      }
      catch (error) {}
    });
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
</script>
