<template>
  <div flex="~ col gap-2">
    <div flex items-center gap-2>
      <MelSelect
        ref="melSelectRef"
        v-model="value"
        :options-api="{
          api: getGoods,
          immediate: false,
        }"
        style="width: 240px"
      />
      <div v-if="value">value: {{ value }}</div>
    </div>

    <div flex="~ wrap items-center gap-2">
      <el-button type="primary" :loading="melSelectRef?.api.isLoading" @click="melSelectRef?.api.execute()">请求</el-button>
      <span c-gray>
        ← <i text-xs>点击发起请求</i>
      </span>
      <div flex="~ grow justify-end">
        <el-checkbox v-model="immediate" size="small">是否立即发起请求</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';
  import type { MelSelectInstance } from '@mixte/mel-components/mel-select';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import axios from 'axios';
  import 'element-plus/es/components/select/style/index';

  const melSelectRef = ref<MelSelectInstance>();

  const value = ref<string>();

  const immediate = ref(false);

  function getGoods() {
    return axios
      .get<ResponseData<SelectorItem[]>>('https://apifoxmock.com/m1/4781098-4434938-default/selector/foods')
      .then(res => res.data.data);
  }

  watchImmediate(immediate, (immediate) => {
    if (immediate)
      melSelectRef.value?.api.execute();
    else
      melSelectRef.value?.api.reset();
  });

  interface ResponseData<T = any> {
    code: `${number}`;
    data: T;
    message: string;
  }

  interface SelectorItem {
    label: string;
    value: string | number;
  };

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <div flex="~ col gap-2">
    <div flex items-center gap-2>
      <MelSelect
        ref="melSelectRef"
        v-model="value"
        :options-api="{
          api: getGoods,
          immediate: ${immediate.value},
        }"
        style="width: 240px"
      />
      <div v-if="value">value: {{ value }}</div>
    </div>

    <el-button
      type="primary" :loading="melSelectRef?.api.isLoading"
      @click="melSelectRef?.api.execute()"
    >
      请求
    </el-button>
  </div>
</template>

<script lang="ts" setup>
  import type { MelSelectInstance } from '@mixte/mel-components/mel-select';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import axios from 'axios';
  import 'element-plus/es/components/select/style/index';

  const melSelectRef = ref<MelSelectInstance>();

  const value = ref<string>();

  function getGoods() {
    return axios
      .get<ResponseData<SelectorItem[]>>('https://apifoxmock.com/m1/4781098-4434938-default/selector/foods')
      .then(res => res.data.data);
  }

  interface ResponseData<T = any> {
    code: \`\${number}\`;
    data: T;
    message: string;
  }

  interface SelectorItem {
    label: string;
    value: string | number;
  };
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
