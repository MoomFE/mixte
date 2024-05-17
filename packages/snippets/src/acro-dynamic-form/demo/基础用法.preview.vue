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
      rules: { required: true, message: '请输入姓名' },
    },
    {
      field: 'age',
      label: '年龄',
      type: 'input-number',
      defaultValue: 18,
      componentProps: { placeholder: '请输入年龄', min: 0 },
      rules: [
        { required: true, message: '请输入年龄' },
        { validator: (value, cb) => value < 18 ? cb('年龄不能小于 18') : cb() },
      ],
    },
    {
      field: 'desc',
      label: '备注',
      type: 'textarea',
      componentProps: { placeholder: '请输入备注', allowClear: true },
    },
  ];
</script>
