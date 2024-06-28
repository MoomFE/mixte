import type { AcroDynamicFormField } from '../types';

/**
 * 定义 AcroDynamicForm 单个字段配置
 * @param field 字段配置
 * @example
 * import { defineAcroDynamicFormField } from '@mixte/snippets/acro-dynamic-form';
 *
 * const field = defineAcroDynamicFormField({
 *  field: 'name',
 *  label: '姓名',
 *  defaultValue: '张三',
 *  // ...
 * });
 */
export function defineAcroDynamicFormField(field: AcroDynamicFormField) {
  return field;
}

/**
 * 定义 AcroDynamicForm 字段配置列表
 * @param fields 字段配置列表
 * @example
 * import { defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';
 *
 * const fields = defineAcroDynamicFormFields([
 *   {
 *     field: 'name',
 *     label: '姓名',
 *     defaultValue: '张三',
 *     // ...
 *   },
 *   {
 *     field: 'age',
 *     label: '年龄',
 *     defaultValue: 18,
 *     // ...
 *   },
 *   // ...
 * ]);
 */
export function defineAcroDynamicFormFields(fields: AcroDynamicFormField[]) {
  return fields;
}
