<template>
  <NForm ref="formRef" v-bind="formProps">
    <NFormItem label="姓名" path="name">
      <NInput v-model:value="form.name" />
    </NFormItem>
    <NFormItem label="年龄" path="age">
      <NInputNumber v-model:value="form.age" :min="0" />
    </NFormItem>

    <NSpace>
      <NButton type="primary" @click="validate">校验</NButton>
      <NButton @click="reset">重置表单验证和表单数据</NButton>
      <NButton @click="resetForm">重置表单数据</NButton>
      <NButton @click="resetValidation">重置表单验证</NButton>
    </NSpace>
  </NForm>
</template>

<script lang="ts" setup>
  import { useNaiveForm } from '@mixte/snippets/useNaiveForm';
  import { NButton, NForm, NFormItem, NInput, NInputNumber, NSpace } from 'naive-ui';

  const formRef = ref<InstanceType<typeof NForm>>();

  const {
    form,
    formProps,
    validate,
    reset,
    resetForm,
    resetValidation,
  } = useNaiveForm({
    formRef,
    form: {
      name: '',
      age: 0,
    },
    formValidateRules: {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    },
  });
</script>
