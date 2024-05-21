<template>
  <ACard title="组件插槽" :body-style="{ paddingBottom: 0 }" :bordered="false">
    <AcroDynamicForm :fields="componentSlotFields" :show-action-button-area="false" auto-label-width />
  </ACard>
  <ACard title="表单项插槽" :body-style="{ paddingBottom: 0 }" :bordered="false">
    <AcroDynamicForm :fields="formItemSlotFields" :show-action-button-area="false" auto-label-width />
  </ACard>
</template>

<script lang="tsx" setup>
  import { AcroDynamicForm, defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';
  import { Button, Option, Tooltip } from '@arco-design/web-vue';

  const componentSlotFields = defineAcroDynamicFormFields([
    {
      field: 'input',
      type: 'input',
      label: '输入框 - 前后缀插槽',
      componentProps: { placeholder: '请输入' },
      componentSlots: {
        prefix: (): any => <i-ant-design-user-outlined class="size-4" />,
        suffix: (): any => {
          return (
            <Tooltip content="hello ~">
              <i-ant-design-exclamation-circle-outlined class="size-4 cursor-pointer" />
            </Tooltip>
          );
        },
      },
    },
    {
      field: 'select',
      type: 'select',
      label: '下拉框 - 默认插槽',
      componentProps: { placeholder: '请选择' },
      componentSlots: {
        default: () => [
          <Option>北京</Option>,
          <Option>上海</Option>,
          <Option>广州</Option>,
        ],
      },
    },
  ]);

  const formItemSlotFields = defineAcroDynamicFormFields([
    {
      field: 'input',
      type: 'input',
      componentProps: { placeholder: '请输入' },
      formItemSlots: {
        label: (): any => <Button>这是 label 插槽的内容</Button>,
        help: (): any => <span>这是 help 插槽的内容</span>,
        extra: (): any => <span>这是 extra 插槽的内容</span>,
      },
    },
  ]);
</script>
