import AcroDynamicForm from './src/index.vue';
import { defineAcroDynamicFormFields } from './src/utils/defineAcroDynamicFormFields';
import type { AcroDynamicFormField, AcroDynamicFormProps } from './src/types';

type AcroDynamicFormInstance = InstanceType<typeof AcroDynamicForm>;

export {
  AcroDynamicForm,
  defineAcroDynamicFormFields,
  AcroDynamicFormInstance,
  AcroDynamicFormField,
  AcroDynamicFormProps,
};
