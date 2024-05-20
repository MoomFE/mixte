import type { Slots } from 'vue';
import type { FieldRule, FormItemInstance } from '@arco-design/web-vue';

interface AcroDynamicFormProps {
  /** 字段配置列表 */
  fields?: AcroDynamicFormField[];
  /** 表单数据 */
  model?: Record<string, any>;
  /**
   * 是否显示操作按钮区域 (提交/重置)
   * @default true
   */
  showActionButtonArea?: boolean;
  /**
   * 是否显示提交按钮
   * @default true
   */
  showSubmitButton?: boolean;
  /**
   * 提交按钮文字
   * @default '提交'
   */
  submitButtonText?: string;
  /**
   * 是否显示重置按钮
   * @default true
   */
  showResetButton?: boolean;
  /**
   * 重置按钮文字
   * @default '重置'
   */
  resetButtonText?: string;
}

// #region AcroDynamicFormField
/** 字段类型 */
type AcroDynamicFormFieldType = 'input' | 'input-number' | 'textarea'
  | 'select' | 'cascader' | 'tree-select' | 'date-picker' | 'time-picker'
  | 'checkbox' | 'checkbox-group' | 'radio' | 'radio-group' | 'switch'
  | 'upload' | 'transfer' | 'slider' | 'rate' | 'auto-complete' | 'mention' | 'input-tag'
  | 'verification-code' | 'color-picker';

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
  /** 传递给组件的插槽 */
  componentSlots?: Slots;
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
  AcroDynamicFormProps,
};
