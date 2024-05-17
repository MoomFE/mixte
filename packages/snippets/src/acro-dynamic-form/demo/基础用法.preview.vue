<template>
  <div>
    <MixteAcroDynamicForm :fields="fields" />
  </div>
</template>

<script lang="ts" setup>
  import type { MixteDynamicFormField } from '@mixte/snippets/acro-dynamic-form';
  import { MixteAcroDynamicForm } from '@mixte/snippets/acro-dynamic-form';

  const fields: MixteDynamicFormField[] = [
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      componentProps: { placeholder: '请输入姓名', allowClear: true },
    },
    {
      field: 'age',
      label: '年龄',
      type: 'input-number',
      defaultValue: 18,
      componentProps: { placeholder: '请输入年龄', min: 0 },
    },
    {
      field: 'desc',
      label: '备注',
      type: 'textarea',
      componentProps: { placeholder: '请输入备注', allowClear: true },
    },
  ];
</script>
