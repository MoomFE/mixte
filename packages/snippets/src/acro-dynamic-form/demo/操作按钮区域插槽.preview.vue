<template>
  <a-card title="操作按钮区域插槽">
    <AcroDynamicForm :fields="fields" auto-label-width>
      <template #actionButtonArea>
        <a-alert>操作按钮区域插槽, 可使用该插槽代替操作按钮区域的渲染</a-alert>
      </template>
    </AcroDynamicForm>
  </a-card>

  <br>

  <a-card title="操作按钮前置插槽 & 操作按钮后置插槽" :body-style="{ paddingBottom: 0 }">
    <AcroDynamicForm :fields="fields" auto-label-width>
      <template #actionButtonPrepend>
        <a-alert>操作按钮前置插槽, 可插入内容到提交按钮前面</a-alert>
      </template>

      <template #actionButtonAppend>
        <a-alert>操作按钮后置插槽, 可插入内容到重置按钮后面</a-alert>
      </template>
    </AcroDynamicForm>
  </a-card>
</template>

<script lang="ts" setup>
  import { AcroDynamicForm, defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';

  const fields = defineAcroDynamicFormFields([
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      componentProps: { placeholder: '请输入姓名', allowClear: true },
    },
  ]);
</script>
