<template>
  <div class="[&_.el-form-item]-mb-2">
    <el-form>
      <el-form-item label="展开的行主键列表" class="mr-0!">
        <el-tree-select
          v-model="expandedRowKeys"
          class="w-full!"
          :data="data.data?.data.list"
          :props="{ label: 'name' }" node-key="id" show-checkbox multiple clearable
        />
      </el-form-item>
    </el-form>
    <el-form inline>
      <el-form-item>
        <template #label>
          <div flex="~ items-center gap-1">
            显示展开按钮的列
            <el-tooltip content="如果不设置, 则使用第一列作为展开列" placement="top">
              <i-ant-design-exclamation-circle-outlined class="size-4" />
            </el-tooltip>
          </div>
        </template>

        <MelSelect
          v-model="expandColumnKey"
          class="w-30!"
          :options="[{ label: '姓名', value: 'name' }, { label: '头像', value: 'avatar' }, { label: '年龄', value: 'age' }, { label: '性别', value: 'gender' }, { label: '邮箱', value: 'email' }, { label: '地址', value: 'address' }, { label: '状态', value: 'statusValue' }]"
          clearable
        />
      </el-form-item>

      <el-form-item label="树形数据缩进宽度">
        <el-input-number v-model="expandedIndent" :min="0" />
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="虚拟列表">
        <el-switch v-model="virtual" />
      </el-form-item>
    </el-form>
  </div>

  <MixteGridTable
    v-model:expanded-row-keys="expandedRowKeys"
    :columns
    :data="data.data?.data.list"
    :loading="data.isLoading"
    :virtual
    :expand-column-key
    :expanded-indent
    style="height: 360px"
  >
    <template #cell-email="{ value }">
      <a :href="`mailto:${value}`">{{ value }}</a>
    </template>
  </MixteGridTable>
</template>

<script lang="tsx" setup>
  import type { ResponseData, ResponseListData, User } from '@/types';
  import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import { useRequestReactive } from '@mixte/use';
  import axios from 'axios';
  import { ElButton, ElImage, ElTag } from 'element-plus';

  const virtual = ref(false);
  const expandColumnKey = ref<string>();
  const expandedRowKeys = ref<string[]>([]);
  const expandedIndent = ref(15);

  const data = useRequestReactive(() => {
    return axios.post<ResponseData<ResponseListData<User>>>('https://m1.apifoxmock.com/m1/4781098-4434938-default/list/user', { pageSize: 10, treeData: true });
  }, {
    immediate: true,
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
