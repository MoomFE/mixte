<template>
  <div grid="~ cols-[auto_auto_1fr]" items-center gap="x2 y1">
    <div text-sm>⬇️ 通过 <code>filterable</code> 进行筛选</div>
    <div text-sm col-span-2>⬇️ 通过外部关键词进行筛选</div>

    <MelSelect
      v-model="value"
      :options-api="getGoods"
      filterable
      :filter-option-method="(query, option) => {
        return `${option.label}`.includes(query) && `${option.label}`.includes(filterValue);
      }"
      style="width: 240px"
    />
    <el-input
      v-model="filterValue"
      placeholder="请输入"
      clearable
      style="width: 220px"
    />
    <div v-if="value">value: {{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import axios from 'axios';
  import 'element-plus/es/components/select/style/index';

  const value = ref<string>();
  const filterValue = ref('');

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
