<template>
  <MixteGridTable
    :columns
    :data="data.data?.data.list"
    :loading="data.isLoading"
  />
</template>

<script lang="ts" setup>
  import type { ResponseData, ResponseListData, User } from '@/types';
  import { MixteGridTable } from '@mixte/components/grid-table';
  import { defineTableColumns } from '@mixte/components/grid-table/utils';
  import { useRequestReactive } from '@mixte/use';
  import axios from 'axios';
  import '@mixte/components/dist/grid-table/css/index.scss';

  const data = useRequestReactive(() => {
    return axios.post<ResponseData<ResponseListData<User>>>('https://m1.apifoxmock.com/m1/4781098-4434938-default/list/user');
  }, {
    immediate: true,
  });

  const columns = defineTableColumns<User>([
    { field: 'name', title: '姓名' },
    { field: 'nameEn', title: '英文名' },
    { field: 'avatar', title: '头像' },
    { field: 'email', title: '邮箱' },
    { field: 'address', title: '地址' },
  ]);
</script>
