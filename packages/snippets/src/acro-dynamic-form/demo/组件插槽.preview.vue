<template>
  <AcroDynamicForm :fields="fields" :show-action-button-area="false" auto-label-width />
</template>

<script lang="tsx" setup>
  import { AcroDynamicForm, defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';
  import { Option, Tooltip } from '@arco-design/web-vue';

  const fields = defineAcroDynamicFormFields([
    {
      field: 'input',
      type: 'input',
      label: '输入框 - 前后缀插槽',
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
      componentSlots: {
        default: () => [
          <Option>北京</Option>,
          <Option>上海</Option>,
          <Option>广州</Option>,
        ],
      },
    },
  ]);
</script>
