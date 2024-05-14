import type { ExtractPropTypes } from 'vue-demi';
import AcroDynamicForm, { acroDynamicFormProps } from './src/index';

export {
  AcroDynamicForm as MixteAcroDynamicForm,
  acroDynamicFormProps as mixteAcroDynamicFormProps,
};

export type MixteAcroDynamicFormProps = ExtractPropTypes<typeof acroDynamicFormProps>;
