<template>
  <Form ref="formRef" :model="model" v-bind="attrs">
    <!-- 动态组件渲染 -->
    <FormItem
      v-for="(field, index) in fields" :key="index"
      :field="field.field"
      :label="field.label"
      :rules="field.rules"
      :validate-trigger="field.validateTrigger ?? ['change', 'blur']"
    >
      <component
        :is="ArcoDesign[pascalCase(field.type)]"
        v-model="model[field.field]"
        v-bind="field.componentProps"
      />
    </FormItem>
    <!-- 操作按钮区域 -->
    <FormItem v-if="showActionButtonArea && (showSubmitButton || showResetButton)">
      <Space>
        <Button v-if="showSubmitButton" type="primary" @click="submit">{{ submitButtonText }}</Button>
        <Button v-if="showResetButton" @click="resetFields()">{{ resetButtonText }}</Button>
      </Space>
    </FormItem>
  </Form>
</template>

<script lang="ts" setup>
  import type { FormInstance } from '@arco-design/web-vue';
  import * as ArcoDesign from '@arco-design/web-vue';
  import { Button, Form, FormItem, Space } from '@arco-design/web-vue';
  import { reactive, ref, toRef, useAttrs } from 'vue';
  import { toReactive } from '@vueuse/core';
  import { pascalCase } from 'mixte';
  import type { AcroDynamicFormProps } from './types';

  const props = withDefaults(defineProps<AcroDynamicFormProps>(), {
    showActionButtonArea: true,
    showSubmitButton: true,
    submitButtonText: '提交',
    showResetButton: true,
    resetButtonText: '重置',
  });

  const attrs = useAttrs();

  const formRef = ref<FormInstance>();

  const model = (props.model ? toReactive(toRef(props, 'model')) : reactive({})) as Record<string, any>;

  props.fields?.forEach((field) => {
    model[field.field] = field.defaultValue;
  });

  function submit() {
    formRef.value!.validate();
  }

  const validate: FormInstance['validate'] = (...args) => formRef.value!.validate(...args);
  const validateField: FormInstance['validateField'] = (...args) => formRef.value!.validateField(...args);
  const resetFields: FormInstance['resetFields'] = (...args) => formRef.value!.resetFields(...args);
  const clearValidate: FormInstance['clearValidate'] = (...args) => formRef.value!.clearValidate(...args);
  const setFields: FormInstance['setFields'] = (...args) => formRef.value!.setFields(...args);
  const scrollToField: FormInstance['scrollToField'] = (...args) => formRef.value!.scrollToField(...args);

  defineExpose({
    validate,
    validateField,
    resetFields,
    reset: resetFields,
    clearValidate,
    setFields,
    scrollToField,
  });
</script>
