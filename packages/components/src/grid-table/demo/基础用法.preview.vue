<template>
  <div class="[&_.el-form-item]-mb-2">
    <el-form inline>
      <el-form-item label="空数据">
        <el-switch v-model="emptyData" />
      </el-form-item>
      <el-form-item label="加载中">
        <el-switch v-model="loading" />
      </el-form-item>
    </el-form>
  </div>

  <MixteGridTable
    :columns
    :data="emptyData ? [] : data.data?.data.list"
    :loading="data.isLoading || loading"
  >
    <template #cell-email="{ value }">
      <a :href="`mailto:${value}`">{{ value }}</a>
    </template>
  </MixteGridTable>
</template>

<script lang="tsx" setup>
  import type { ResponseData, ResponseListData, User } from '@/types';
  import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
  import { useRequestReactive } from '@mixte/use';
  import axios from 'axios';
  import { ElButton, ElImage, ElTag } from 'element-plus';

  const emptyData = ref(false);
  const loading = ref(false);

  const data = useRequestReactive(() => {
    return axios.post<ResponseData<ResponseListData<User>>>('https://m1.apifoxmock.com/m1/4781098-4434938-default/list/user', { pageSize: 2 });
  }, {
    immediate: true,
  });

  const columns = defineTableColumns<User>([
    {
      field: 'index',
      title: '#',
      fixed: 'left',
      align: 'center',
      render: ({ index }) => index + 1,
    },
    { field: 'name', title: '姓名', render: ({ value, record }) => `${value} (${record.nameEn})` },
    {
      field: 'avatar',
      title: '头像',
      align: 'center',
      render: ({ value }) => {
        return <ElImage class="size-8" src={value} preview-src-list={[value]} preview-teleported lazy />;
      },
    },
    { field: 'age', title: '年龄', align: 'center' },
    { field: 'gender', title: '性别', align: 'center' },
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
