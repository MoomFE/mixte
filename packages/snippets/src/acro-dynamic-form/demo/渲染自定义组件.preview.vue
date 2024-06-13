<template>
  <AcroDynamicForm :fields="fields" auto-label-width :action-button-area="false">
    <template #name-xxx="{ model }">
      <ElInput
        v-model="model.name"
        placeholder="插槽方式渲染的自定义组件 ( 绑定了姓名字段值 )" clearable
      />
    </template>

    <template #name-yyy="{ model, Component }">
      <a-alert type="warning" title="插槽方式包裹的外层内容" :show-icon="false">
        <a-input-group class="w-full">
          <component :is="Component" />
          <a-input v-model="model['slot-origin-component']" placeholder="这是通过插槽放置的同级组件" error />
        </a-input-group>
      </a-alert>
    </template>
  </AcroDynamicForm>
</template>

<script lang="tsx" setup>
  import { AcroDynamicForm, defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';
  import { ElInput } from 'element-plus';
  import 'element-plus/es/components/input/style/css';

  const fields = defineAcroDynamicFormFields([
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      componentProps: { placeholder: '请输入姓名', allowClear: true },
    },

    {
      field: 'render',
      label: '渲染函数',
      render: ({ model }) => (
        <ElInput
          v-model={model.name}
          placeholder="渲染函数方式渲染的自定义组件 ( 绑定了姓名字段值 )"
          clearable
        />
      ),
    },
    {
      field: 'slot',
      label: '插槽',
      render: 'name-xxx',
    },

    {
      field: 'render-origin-component',
      label: '渲染函数包装原组件',
      type: 'input',
      componentProps: { placeholder: '这是原组件', allowClear: true, style: 'width: 180px' },
      render: ({ model, Component }) => (
        <a-alert type="warning" title="渲染函数方式包裹的外层内容" show-icon={false}>
          <a-input-group class="w-full">
            {Component()}
            <a-input v-model={model['render-origin-component']} placeholder="这是通过渲染函数放置的同级组件" error />
          </a-input-group>
        </a-alert>
      ),
    },
    {
      field: 'slot-origin-component',
      label: '插槽包装原组件',
      type: 'input',
      componentProps: { placeholder: '这是原组件', allowClear: true, style: 'width: 180px' },
      render: 'name-yyy',
    },
  ]);
</script>
