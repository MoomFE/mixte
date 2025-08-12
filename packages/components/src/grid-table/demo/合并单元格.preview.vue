<template>
  <div class="h-100">
    <MixteGridTable
      :columns
      :data="list"
      :loading="data.isLoading"
      bordered
    >
      <template #cell-email="{ value }">
        <a :href="`mailto:${value}`">{{ value }}</a>
      </template>
    </MixteGridTable>
  </div>
</template>

<script lang="tsx" setup>
  import type { ResponseData, ResponseListData, User } from '@/types';
  import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
  import { useRequestReactive } from '@mixte/use';
  import axios from 'axios';
  import { ElButton, ElImage, ElTag } from 'element-plus';

  const data = useRequestReactive(() => {
    return axios.post<ResponseData<ResponseListData<User>>>('https://m1.apifoxmock.com/m1/4781098-4434938-default/list/user', { pageSize: 20 });
  }, {
    immediate: true,
  });

  const list = computed(() => data.data?.data.list || []);

  const columns = defineTableColumns<User>([
    {
      field: 'index',
      title: '#',
      fixed: 'left',
      align: 'center',
      render: ({ index }) => index + 1,
    },
    {
      field: 'name',
      title: '姓名',
      render: ({ value, record }) => `${value} (${record.nameEn})`,
      colSpan: ({ index }) => (index % 2 === 0 ? 2 : 1),
    },
    {
      field: 'avatar',
      title: '头像',
      align: 'center',
      render: ({ value }) => {
        return <ElImage class="size-8" src={value} preview-src-list={[value]} preview-teleported lazy />;
      },
    },
    { field: 'age', title: '年龄', align: 'center' },
    {
      field: 'gender',
      title: '性别',
      align: 'center',
      rowSpan: ({ index }) => {
        const currentGender = list.value[index]?.gender;
        let count = 1;
        for (let i = index + 1; i < list.value.length; i++) {
          if (list.value[i]?.gender === currentGender) count++;
          else break;
        }
        return count;
      },
    },
    { field: 'email', title: '邮箱' },
    { field: 'address', title: '地址' },
    {
      field: 'statusValue',
      title: '状态',
      align: 'center',
      render: ({ value, record }) => <ElTag type={value === 1 ? 'success' : 'info'}>{record.status}</ElTag>,
    },
    {
      field: 'action',
      title: '操作',
      fixed: 'right',
      align: 'center',
      render: () => (
        <div>
          <ElButton type="primary" size="small" link>编辑</ElButton>
          <ElButton type="danger" size="small" link>删除</ElButton>
        </div>
      ),
    },
  ]);
</script>
