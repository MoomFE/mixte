<template>
  <MixteGridTable
    :columns
    :data="list"
    :loading="data.isLoading"
  />
</template>

<script lang="tsx" setup>
  import type { ResponseData, ResponseListData, User } from '@/types';
  import { MixteGridTable } from '@mixte/components/grid-table';
  import { defineTableColumns } from '@mixte/components/grid-table/utils';
  import { useRequestReactive } from '@mixte/use';
  import axios from 'axios';
  import { ElButton, ElImage } from 'element-plus';
  import '@mixte/components/dist/grid-table/css/index.scss';

  const data = useRequestReactive(() => {
    return axios.post<ResponseData<ResponseListData<User>>>('https://m1.apifoxmock.com/m1/4781098-4434938-default/list/user', { pageSize: 2 });
  }, {
    immediate: true,
  });

  const list = computed(() => {
    return (data.data?.data.list || []).map((item) => {
      return {
        ...item,
        ...Array.from({ length: 20 }).reduce<Record<string, string>>((acc, _, index) => {
          acc[`field${index + 1}`] = item.nameEn;
          return acc;
        }, {}),
      };
    });
  });

  const columns = defineTableColumns<User>([
    {
      field: 'name',
      title: '姓名',
      fixed: 'left',
      render: ({ value, record }) => `${value} (${record.nameEn})`,
    },
    {
      field: 'avatar',
      title: '头像',
      align: 'center',
      render: ({ value }) => {
        return <ElImage class="size-8" src={value} preview-src-list={[value]} preview-teleported lazy />;
      },
    },
    {
      field: 'age',
      title: '年龄',
      align: 'center',
      fixed: 'left',
    },

    ...Array.from({ length: 20 }).map((_, index) => ({
      field: `field${index + 1}`,
      title: `Column ${index + 1}`,
    })),

    {
      field: 'action1',
      title: '操作1',
      fixed: 'right',
      render: () => <ElButton type="primary" size="small" link>查看</ElButton>,
    },
    {
      field: 'action2',
      title: '操作2',
      render: () => <ElButton type="primary" size="small" link>编辑</ElButton>,
    },
    {
      field: 'action3',
      title: '操作3',
      fixed: 'right',
      render: () => <ElButton type="danger" size="small" link>删除</ElButton>,
    },
  ]);
</script>
