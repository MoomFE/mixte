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
      <NButton @click="reset">重置</NButton>
    </NSpace>
  </NForm>
</template>

<script lang="ts" setup>
  import { NButton, NForm, NFormItem, NInput, NInputNumber, NSpace } from 'naive-ui';
  import { useNaiveForm } from '@mixte/snippets/useNaiveForm';

  const formRef = ref<InstanceType<typeof NForm>>();

  const { form, formProps, validate, reset } = useNaiveForm({
    formRef,
    form: {
      name: '',
      age: 0,
    },
    formValidateRules: {
      name: [{ required: true, message: '请输入姓名' }],
    },
  });
</script>
