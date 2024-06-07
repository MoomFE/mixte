import AcroDynamicForm from './src/index.vue';
import { defineAcroDynamicFormField, defineAcroDynamicFormFields } from './src/utils/defineAcroDynamicFormFields';
import type { AcroDynamicFormField, AcroDynamicFormProps } from './src/types';

type AcroDynamicFormInstance = InstanceType<typeof AcroDynamicForm>;

export {
  AcroDynamicForm,

  AcroDynamicFormInstance,
  AcroDynamicFormProps,
  AcroDynamicFormField,

  defineAcroDynamicFormField,
  defineAcroDynamicFormFields,
};
