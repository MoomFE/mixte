<template>
  <Form ref="formRef" :model="model" v-bind="attrs">
    <!-- 动态组件渲染 -->
    <RenderFormItem v-for="(field, index) in fields" :key="index" :field="field">
      <RenderComponent :field="field" :model="model" />
    </RenderFormItem>
    <!-- 操作按钮区域 -->
    <FormItem v-if="showActionButtonArea && (showSubmitButton || showResetButton)">
      <Space>
        <Button v-if="showSubmitButton" type="primary" @click="emit('submit', model)">{{ submitButtonText }}</Button>
        <Button v-if="showResetButton" @click="emit('reset')">{{ resetButtonText }}</Button>
      </Space>
    </FormItem>
  </Form>
</template>

<script lang="tsx" setup>
  import type { FormInstance } from '@arco-design/web-vue';
  import { Button, Form, FormItem, Space } from '@arco-design/web-vue';
  import { reactive, ref, toRef, useAttrs } from 'vue';
  import { toReactive } from '@vueuse/core';
  import RenderFormItem from './components/RenderFormItem.vue';
  import RenderComponent from './components/RenderComponent.vue';
  import type { AcroDynamicFormProps } from './types';

  const props = withDefaults(defineProps<AcroDynamicFormProps>(), {
    showActionButtonArea: true,
    showSubmitButton: true,
    submitButtonText: '提交',
    showResetButton: true,
    resetButtonText: '重置',
  });
  const emit = defineEmits<{
    /** 点击了提交按钮的事件 */
    submit: [model: Record<string, any>];
    /** 点击了重置按钮的事件 */
    reset: [];
  }>();

  const attrs = useAttrs();

  const formRef = ref<FormInstance>();

  const model = (props.model ? toReactive(toRef(props, 'model')) : reactive({})) as Record<string, any>;

  props.fields?.forEach((field) => {
    model[field.field] = field.defaultValue;
  });

  const validate: FormInstance['validate'] = (...args) => formRef.value!.validate(...args);
  const validateField: FormInstance['validateField'] = (...args) => formRef.value!.validateField(...args);
  const resetFields: FormInstance['resetFields'] = (...args) => formRef.value!.resetFields(...args);
  const clearValidate: FormInstance['clearValidate'] = (...args) => formRef.value!.clearValidate(...args);
  const setFields: FormInstance['setFields'] = (...args) => formRef.value!.setFields(...args);
  const scrollToField: FormInstance['scrollToField'] = (...args) => formRef.value!.scrollToField(...args);

  defineExpose({
    validate, validateField, resetFields, clearValidate, setFields, scrollToField, // eslint-disable-line antfu/consistent-list-newline
    reset: resetFields,
  } as {
    /** 校验全部表单数据 */
    validate: typeof validate;
    /** 校验部分表单数据 */
    validateField: typeof validateField;
    /** 重置表单数据 */
    resetFields: typeof resetFields;
    /** 清除校验状态 */
    clearValidate: typeof clearValidate;
    /** 设置表单项的值和状态 */
    setFields: typeof setFields;
    /** 滚动到指定表单项 */
    scrollToField: typeof scrollToField;

    /** 重置表单数据, 是 `resetFields` 方法的别名 */
    reset: typeof resetFields;
  });
</script>
