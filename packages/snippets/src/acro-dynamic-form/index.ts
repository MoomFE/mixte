import type { ExtractPropTypes } from 'vue-demi';
import type { DynamicFormField } from './src/index';
import AcroDynamicForm, { acroDynamicFormProps } from './src/index';

export {
  AcroDynamicForm as MixteAcroDynamicForm,
  acroDynamicFormProps as mixteAcroDynamicFormProps,
};

export type MixteDynamicFormField = DynamicFormField;

export type MixteAcroDynamicFormProps = ExtractPropTypes<typeof acroDynamicFormProps>;
