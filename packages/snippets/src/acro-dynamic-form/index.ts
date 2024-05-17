import type { ExtractPropTypes } from 'vue-demi';
import AcroDynamicForm, { acroDynamicFormProps } from './src/index';
import type { DynamicFormField } from './src/types';

export {
  AcroDynamicForm as MixteAcroDynamicForm,
  acroDynamicFormProps as mixteAcroDynamicFormProps,
};

export type MixteDynamicFormField = DynamicFormField;

export type MixteAcroDynamicFormProps = ExtractPropTypes<typeof acroDynamicFormProps>;
