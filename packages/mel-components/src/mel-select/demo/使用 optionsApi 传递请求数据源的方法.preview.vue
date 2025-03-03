<template>
  <div flex items-center gap-2>
    <MelSelect
      v-model="value"
      :options-api="getGoods"
      style="width: 240px"
    />
    <div v-if="value">value: {{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import axios from 'axios';
  import 'element-plus/es/components/select/style/index';

  const value = ref<string>();

  function getGoods() {
    return axios
      .get<ResponseData<SelectorItem[]>>('https://apifoxmock.com/m1/4781098-4434938-default/selector/foods');
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
