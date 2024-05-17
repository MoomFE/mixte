import type { FieldRule } from '@arco-design/web-vue';

// #region DynamicFormField
/** 字段配置  */
interface DynamicFormField {
  /** 字段类型 */
  type: 'input' | 'input-number' | 'textarea';
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
  validateTrigger?: 'change' | 'input' | 'focus' | 'blur' | ('change' | 'input' | 'focus' | 'blur')[];
};
// #endregion DynamicFormField

export {
  DynamicFormField,
};
