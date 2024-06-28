<template>
  <Form ref="formRef" :model="model" v-bind="attrs">
    <!-- 动态组件渲染 -->
    <RenderFormItem v-for="(field, index) in finalFields" :key="index" :field="field">
      <RenderComponent :field="field" :model="model" :slots="slots" />
    </RenderFormItem>
    <!-- 操作按钮区域 -->
    <slot v-if="slots.actionButtonArea" name="actionButtonArea" />
    <FormItem v-else-if="showActionButtonArea" v-bind="actionButtonArea.props">
      <Space v-bind="actionButtonArea.spaceProps">
        <slot v-if="slots.actionButtonPrepend" name="actionButtonPrepend" />
        <Button v-if="submitButton.show" type="primary" v-bind="submitButton.props" @click="emit('submit', model)">{{ submitButton.text }}</Button>
        <Button v-if="resetButton.show" v-bind="resetButton.props" @click="emit('reset')">{{ resetButton.text }}</Button>
        <slot v-if="slots.actionButtonAppend" name="actionButtonAppend" />
      </Space>
    </FormItem>
  </Form>
</template>

<script lang="tsx" setup>
  import type { FormInstance } from '@arco-design/web-vue';
  import { Button, Form, FormItem, Space } from '@arco-design/web-vue';
  import { computed, reactive, ref, toRef, useAttrs } from 'vue';
  import { toReactive } from '@vueuse/core';
  import RenderFormItem from './components/RenderFormItem.vue';
  import RenderComponent from './components/RenderComponent.vue';
  import { useActionButtonArea } from './composables/useActionButtonArea';
  import type { AcroDynamicFormProps, AcroDynamicFormSlots, ActionButtonAreaOptions, ResetButtonOptions, SubmitButtonOptions } from './types';
  import { resolveAcroDynamicFormFieldConfig } from './utils/defineAcroDynamicFormPreset';

  const props = withDefaults(defineProps<AcroDynamicFormProps>(), {
    // @ts-expect-error 不加 as 时, 使用该参数时, 类型丢失, 只剩下 boolean 类型
    actionButtonArea: true as (ActionButtonAreaOptions | boolean),
    // @ts-expect-error 不加 as 时, 使用该参数时, 类型丢失, 只剩下 boolean 类型
    submitButton: true as (SubmitButtonOptions | boolean),
    // @ts-expect-error 不加 as 时, 使用该参数时, 类型丢失, 只剩下 boolean 类型
    resetButton: true as (ResetButtonOptions | boolean),
  });
  const emit = defineEmits<{
    /** 点击了提交按钮的事件 */
    submit: [model: Record<string, any>];
    /** 点击了重置按钮的事件 */
    reset: [];
  }>();
  const slots = defineSlots<AcroDynamicFormSlots>();

  const attrs = useAttrs();

  const formRef = ref<FormInstance>();

  const model = (props.model ? toReactive(toRef(props, 'model')) : reactive({})) as Record<string, any>;

  const finalFields = computed(() => {
    return props.fields?.map(resolveAcroDynamicFormFieldConfig);
  });

  finalFields.value?.forEach((field) => {
    if (field.defaultValue != null)
      model[field.field] = model[field.field] ?? field.defaultValue;
  });

  const {
    showActionButtonArea,
    actionButtonArea,
    submitButton,
    resetButton,
  } = useActionButtonArea(props, slots);

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
