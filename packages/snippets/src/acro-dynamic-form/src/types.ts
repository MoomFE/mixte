import type { FieldRule, FormItemInstance } from '@arco-design/web-vue';

// #region AcroDynamicFormField
/** 字段类型 */
type AcroDynamicFormFieldType = 'input' | 'input-number' | 'textarea';

/** 字段配置  */
interface AcroDynamicFormField<T extends AcroDynamicFormFieldType = AcroDynamicFormFieldType> {
  /** 字段类型 */
  type: T;
  /** 字段名 */
  field: string;
  /** 标签 */
  label?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 传递给组件的参数 */
  componentProps?: Record<string, any>;
  /** 校验规则 */
  rules?: FieldRule | FieldRule[];
  /**
   * 触发校验的事件
   * @default ['change', 'blur']
   */
  validateTrigger?: FormItemInstance['validateTrigger'];
};
// #endregion AcroDynamicFormField

export {
  AcroDynamicFormField,
};
