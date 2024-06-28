<template>
  <AcroDynamicForm
    :fields="fields"
    :action-button-area="false"
    auto-label-width
  />
</template>

<script lang="tsx" setup>
  import { AcroDynamicForm, defineAcroDynamicFormFields, defineAcroDynamicFormPreset } from '@mixte/snippets/acro-dynamic-form';
  import { isMobile } from '@mixte/validator';

  const base = defineAcroDynamicFormPreset({
    // 一个通用预设
    input: {
      type: 'input',
      componentProps: { placeholder: '预设的提示文字', allowClear: true, showWordLimit: true, maxLength: 25 },
    },
    // 一个包含了逻辑的预设示例
    phoneInput: {
      type: 'input',
      componentProps: { placeholder: '请输入手机号' },
      componentSlots: {
        prepend: () => '+86',
      },
      rules: [
        { required: true, message: '请输入手机号' },
        { validator: (value, callback) => isMobile(value) ? callback() : callback('请输入正确的手机号') },
      ],
    },
  });

  const fields = defineAcroDynamicFormFields([
    {
      field: 'field-1',
      label: '使用预设配置',
      preset: base.input,
    },
    {
      field: 'field-2',
      label: '支持覆盖预设配置',
      preset: base.input,
      componentProps: { placeholder: '覆盖预设的提示文字', maxLength: 666 },
      componentSlots: {
        append: () => '新加的插槽',
      },
    },
    {
      field: 'field-3',
      label: '多个预设合并',
      preset: [base.input, base.phoneInput],
      componentProps: { maxLength: 11 },
    },
  ]);
</script>
