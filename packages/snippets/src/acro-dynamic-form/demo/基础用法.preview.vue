<template>
  <AcroDynamicForm
    ref="acroDynamicFormRef"
    :fields="fields"
    @submit="handleSubmit"
    @reset="handleReset"
  />
</template>

<script lang="ts" setup>
  import type { AcroDynamicFormField, AcroDynamicFormInstance } from '@mixte/snippets/acro-dynamic-form';
  import { AcroDynamicForm } from '@mixte/snippets/acro-dynamic-form';

  const fields: AcroDynamicFormField[] = [
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

  const acroDynamicFormRef = ref<AcroDynamicFormInstance>();

  async function handleSubmit(model: Record<string, any>) {
    const errors = await acroDynamicFormRef.value!.validate();

    if (errors)
      return console.error(errors);

    // 执行提交逻辑
    console.log(model);
  }

  function handleReset() {
    acroDynamicFormRef.value!.reset();
  }
</script>
