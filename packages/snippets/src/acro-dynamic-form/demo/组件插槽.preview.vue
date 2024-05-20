<template>
  <AcroDynamicForm :fields="fields" />
</template>

<script lang="tsx" setup>
  import type { AcroDynamicFormField, AcroDynamicFormInstance } from '@mixte/snippets/acro-dynamic-form';
  import { AcroDynamicForm } from '@mixte/snippets/acro-dynamic-form';

  const fields: AcroDynamicFormField[] = [
    {
      field: 'size',
      type: 'select',
      componentSlots: {
        default: () => {
          return [
            <a-option>Beijing</a-option>,
            <a-option>Shanghai</a-option>,
            <a-option>Guangzhou</a-option>,
          ];
        },
      },
    },
  ];
</script>
