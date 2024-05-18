import type { ExtractPropTypes } from 'vue';
import AcroDynamicForm, { acroDynamicFormProps } from './src/index';
import type { AcroDynamicFormField } from './src/types';

export {
  AcroDynamicForm as MixteAcroDynamicForm,
  acroDynamicFormProps as mixteAcroDynamicFormProps,
};

export type MixteAcroDynamicFormField = AcroDynamicFormField;

export type MixteAcroDynamicFormProps = ExtractPropTypes<typeof acroDynamicFormProps>;
