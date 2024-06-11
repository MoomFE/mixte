<template>
  <Form ref="formRef" :model="model" v-bind="attrs">
    <!-- 动态组件渲染 -->
    <RenderFormItem v-for="(field, index) in fields" :key="index" :field="field">
      <RenderComponent v-if="field.type" :field="(field as AcroDynamicFormComponentField)" :model="model" />
    </RenderFormItem>
    <!-- 操作按钮区域 -->
    <slot v-if="slots.actionButtonArea" name="actionButtonArea" />
    <FormItem v-else-if="showActionButtonArea" v-bind="actionButtonAreaProps">
      <Space>
        <slot v-if="slots.actionButtonPrepend" name="actionButtonPrepend" />
        <Button v-if="showSubmitButton" type="primary" v-bind="submitButtonProps" @click="emit('submit', model)">{{ submitButtonText }}</Button>
        <Button v-if="showResetButton" v-bind="resetButtonProps" @click="emit('reset')">{{ resetButtonText }}</Button>
        <slot v-if="slots.actionButtonAppend" name="actionButtonAppend" />
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
  import { useActionButtonArea } from './composables/useActionButtonArea';
  import type { AcroDynamicFormComponentField, AcroDynamicFormProps } from './types';

  const props = withDefaults(defineProps<AcroDynamicFormProps>(), {
    actionButtonArea: true,
    submitButton: true,
    resetButton: true,
  });
  const emit = defineEmits<{
    /** 点击了提交按钮的事件 */
    submit: [model: Record<string, any>];
    /** 点击了重置按钮的事件 */
    reset: [];
  }>();
  const slots = defineSlots<{
    /** 操作按钮区域插槽, 可使用该插槽代替操作按钮区域的渲染 */
    actionButtonArea?: () => void;
    /** 操作按钮前置插槽, 可插入内容到提交按钮前面 */
    actionButtonPrepend?: () => void;
    /** 操作按钮后置插槽, 可插入内容到重置按钮后面 */
    actionButtonAppend?: () => void;
  }>();

  const attrs = useAttrs();

  const formRef = ref<FormInstance>();

  const model = (props.model ? toReactive(toRef(props, 'model')) : reactive({})) as Record<string, any>;

  props.fields?.forEach((field) => {
    if (field.defaultValue != null)
      model[field.field] = model[field.field] ?? field.defaultValue;
  });

  const {
    showActionButtonArea, showSubmitButton, showResetButton, // eslint-disable-line antfu/consistent-list-newline
    submitButtonText, resetButtonText, // eslint-disable-line antfu/consistent-list-newline
    actionButtonAreaProps, submitButtonProps, resetButtonProps, // eslint-disable-line antfu/consistent-list-newline
  } = useActionButtonArea(props);

  const validate: FormInstance['validate'] = (...args) => formRef.value!.validate(...args);
  const validateField: FormInstance['validateField'] = (...args) => formRef.value!.validateField(...args);
  const resetFields: FormInstance['resetFields'] = (...args) => formRef.value!.resetFields(...args);
  const clearValidate: FormInstance['clearValidate'] = (...args) => formRef.value!.clearValidate(...args);
  const setFields: FormInstance['setFields'] = (...args) => formRef.value!.setFields(...args);
  const scrollToField: FormInstance['scrollToField'] = (...args) => formRef.value!.scrollToField(...args);

  defineExpose({
    validate, validateField, resetFields, clearValidate, setFields, scrollToField, // eslint-disable-line antfu/consistent-list-newline
    reset: resetFields,
    model,
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

    /** 表单数据 */
    model: typeof model;
  });
</script>
