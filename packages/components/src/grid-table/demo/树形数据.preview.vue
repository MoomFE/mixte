<template>
  <div class="[&_.el-form-item]-mb-2">
    <el-form>
      <el-form-item label="展开的行主键列表" class="mr-0!">
        <NTreeSelect
          v-model:value="expandedRowKeys"
          :options="data.data?.data.list"
          key-field="id" label-field="name"
          checkable check-strategy="parent" clearable multiple max-tag-count="responsive"
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
        <el-input-number v-model="expandedIndent" :min="0" placeholder="15" />
      </el-form-item>
    </el-form>

    <div mb-3>
      <ElButton type="primary" link @click="tableRef?.expandAllRows()"><i-codicon-expand-all class="size-4" />展开所有行</ElButton>
      <ElButton type="primary" link @click="tableRef?.collapseAllRows()"><i-codicon-collapse-all class="size-4" /> 折叠所有行</ElButton>
    </div>
  </div>

  <MixteGridTable
    ref="tableRef"
    v-model:expanded-row-keys="expandedRowKeys"
    :columns
    :data="data.data?.data.list"
    :loading="data.isLoading"
    :expand-column-key
    :expanded-indent
    virtual
    style="height: 360px"
  >
    <template #cell-email="{ value }">
      <a :href="`mailto:${value}`">{{ value }}</a>
    </template>
  </MixteGridTable>
</template>

<script lang="tsx" setup>
  import type { ResponseData, ResponseListData, User } from '@/types';
  import type { MixteGridTableInstance } from '@mixte/components/grid-table';
  import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
  import { MelSelect } from '@mixte/mel-components/mel-select';
  import { useRequestReactive } from '@mixte/use';
  import axios from 'axios';
  import { ElButton, ElImage, ElTag } from 'element-plus';
  import { deepForEach } from 'mixte';
  import { NTreeSelect } from 'naive-ui';

  const tableRef = ref<MixteGridTableInstance>();

  const expandColumnKey = ref<string>();
  const expandedRowKeys = ref<string[]>([]);
  const expandedIndent = ref(15);

  const data = useRequestReactive(() => {
    return axios.post<ResponseData<ResponseListData<User>>>('https://m1.apifoxmock.com/m1/4781098-4434938-default/list/user', { pageSize: 10, treeData: true });
  }, {
    immediate: true,
    onSuccess: (res) => {
      deepForEach(res.data.data.list, (item) => {
        item.disabled = !item.children?.length;
      });
    },
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
