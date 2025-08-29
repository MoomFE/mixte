<template>
  <div grid="~ cols-[auto_1fr]" items-center gap="x2 y1">
    <div text-sm col-span-2>⬇️ 可输入 <code>蔬菜</code>、<code>肉</code>、<code>水果</code> 筛选不同的类型的数据</div>

    <MelSelect
      ref="melSelectRef"
      v-model="value"
      filterable remote
      :options-api="{
        api: getGoods,
        remoteKey: 'type',
      }"
      style="width: 240px"
    />
    <div v-if="value">value: {{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
  import type { MelSelectInstance } from '@mixte/mel-components/mel-select';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import axios from 'axios';
  import 'element-plus/es/components/select/style/index';

  const melSelectRef = ref<MelSelectInstance>();

  const value = ref<string>();

  // 搜索时会将输入值作为 `optionsApi.remoteKey` 字段名的值传入 `optionsApi.api` 的方法并发起请求
  function getGoods(params?: { type: string }) {
    return axios
      .get<ResponseData<SelectorItem[]>>('https://apifoxmock.com/m1/4781098-4434938-default/selector/foods', {
        params,
      });
  }

  interface ResponseData<T = any> {
    code: `${number}`;
    data: T;
    message: string;
  }

  interface SelectorItem {
    label: string;
    value: string | number;
  };
</script>
