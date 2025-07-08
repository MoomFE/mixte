<template>
  <MixteGridTable
    :columns
    :data="data"
    virtual
    style="height: 520px"
  />
</template>

<script lang="tsx" setup>
  import { defineTableColumns, MixteGridTable } from '@mixte/components/grid-table';
  import { ElButton } from 'element-plus';
  import { randomNatural } from 'mixte';

  interface User {
    id: string;
    height: number;
    fistName: string;
    lastName: string;
    age: number;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
  }

  const data = shallowRef<User[]>(generateData());

  const columns = defineTableColumns<User>([
    {
      field: 'index',
      title: '#',
      fixed: 'left',
      align: 'center',
      render: ({ index }) => index + 1,
    },
    {
      field: 'height',
      title: 'height',
      fixed: 'left',
      align: 'center',
      render: ({ value }) => (
        <div
          class="w-full flex justify-center items-center bg-neutral-2 px-2 rounded"
          style={{ height: `${value}px` }}
        >
          {value}px
        </div>
      ),
    },

    { field: 'id', title: 'ID' },
    { field: 'fistName', title: 'FistName' },
    { field: 'lastName', title: 'LastName' },
    { field: 'age', title: 'Age', align: 'center' },
    { field: 'col1', title: 'Col 1' },
    { field: 'col2', title: 'Col 2' },
    { field: 'col3', title: 'Col 3' },
    { field: 'col4', title: 'Col 4' },
    { field: 'col5', title: 'Col 5' },
    { field: 'col6', title: 'Col 6' },

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

  function generateData(): User[] {
    const newData: User[] = [];

    for (let i = 0; i < 10000; i++) {
      newData.push({
        id: `id-${i}`,
        height: randomNatural(25, 150),
        fistName: `FistName-${i}`,
        lastName: `LastName-${i}`,
        age: randomNatural(18, 35),
        col1: `Col 1 - ${i}`,
        col2: `Col 2 - ${i}`,
        col3: `Col 3 - ${i}`,
        col4: `Col 4 - ${i}`,
        col5: `Col 5 - ${i}`,
        col6: `Col 6 - ${i}`,
      });
    }

    return newData;
  }
</script>
