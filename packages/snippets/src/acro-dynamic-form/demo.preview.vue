<template>
  <div>
    <MixteAcroDynamicForm :fields="fields" />
  </div>
</template>

<script lang="ts" setup>
  import type { MixteDynamicFormField } from '@mixte/snippets/acro-dynamic-form';
  import { MixteAcroDynamicForm } from '@mixte/snippets/acro-dynamic-form';

  const fields: MixteDynamicFormField[] = [
    { field: 'name', label: '姓名', type: 'input' },
    { field: 'age', label: '年龄', type: 'input-number' },
    { field: 'desc', label: '备注', type: 'textarea' },
  ];
</script>
