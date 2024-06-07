import type { VNodeChild } from 'vue';
import type { AutoCompleteInstance, CascaderInstance, CascaderPanelInstance, CheckboxGroupInstance, CheckboxInstance, ColorPickerInstance, DatePickerInstance, FieldRule, FormItemInstance, InputGroupInstance, InputInstance, InputNumberInstance, InputPasswordInstance, InputSearchInstance, InputTagInstance, MentionInstance, MonthPickerInstance, QuarterPickerInstance, RadioGroupInstance, RadioInstance, RangePickerInstance, RateInstance, SelectInstance, SliderInstance, SwitchInstance, TextareaInstance, TimePickerInstance, TransferInstance, TreeSelectInstance, UploadInstance, VerificationCodeInstance, WeekPickerInstance, YearPickerInstance } from '@arco-design/web-vue';

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
/** 字段配置 */
type AcroDynamicFormField = AcroDynamicFormComponentField | AcroDynamicFormFieldBase;

/** 字段通用配置 */
interface AcroDynamicFormFieldBase {
  /** 字段名 */
  field: string;
  /** 标签 */
  label?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 校验规则 */
  rules?: FieldRule | FieldRule[];
  /**
   * 触发校验的事件
   * @default ['change', 'blur']
   */
  validateTrigger?: FormItemInstance['validateTrigger'];
  /** 传递给 FormItem 组件的参数 */
  formItemProps?: Omit<FormItemInstance['$props'], 'field' | 'label' | 'rules' | 'validateTrigger'>;
  /** 传递给 FormItem 组件的插槽 */
  formItemSlots?: Record<string, () => VNodeChild>;
  /** 字段类型 */
  type?: string;
  /** 传递给组件的参数 */
  componentProps?: Record<string, any>;
}

/** 组件字段配置 */
type AcroDynamicFormComponentField = {
  [T in AcroDynamicFormFieldType]: Omit<AcroDynamicFormFieldBase, 'type' | 'componentProps'> & {
    /** 字段类型 */
    type: T;
    /** 传递给组件的参数 */
    componentProps?: Omit<AcroDynamicFormFieldComponentPropsMap[T], 'modelValue'>;
    /** 传递给组件的插槽 */
    componentSlots?: Record<string, () => VNodeChild>;
  };
}[AcroDynamicFormFieldType];

/** 字段类型 */
type AcroDynamicFormFieldType = keyof AcroDynamicFormFieldComponentPropsMap;

/** 字段配置组件参数映射 */
interface AcroDynamicFormFieldComponentPropsMap {
  'input': InputInstance['$props'];
  'input-group': InputGroupInstance['$props'];
  'input-number': InputNumberInstance['$props'];
  'input-password': InputPasswordInstance['$props'];
  'input-search': InputSearchInstance['$props'];
  'input-tag': InputTagInstance['$props'];
  'textarea': TextareaInstance['$props'];
  'select': SelectInstance['$props'];
  'cascader': CascaderInstance['$props'];
  'cascader-panel': CascaderPanelInstance['$props'];
  'tree-select': TreeSelectInstance['$props'];
  'date-picker': DatePickerInstance['$props'];
  'time-picker': TimePickerInstance['$props'];
  'year-picker': YearPickerInstance['$props'];
  'month-picker': MonthPickerInstance['$props'];
  'quarter-picker': QuarterPickerInstance['$props'];
  'week-picker': WeekPickerInstance['$props'];
  'range-picker': RangePickerInstance['$props'];
  'checkbox': CheckboxInstance['$props'];
  'checkbox-group': CheckboxGroupInstance['$props'];
  'radio': RadioInstance['$props'];
  'radio-group': RadioGroupInstance['$props'];
  'switch': SwitchInstance['$props'];
  'upload': UploadInstance['$props'];
  'transfer': TransferInstance['$props'];
  'slider': SliderInstance['$props'];
  'rate': RateInstance['$props'];
  'auto-complete': AutoCompleteInstance['$props'];
  'mention': MentionInstance['$props'];
  'verification-code': VerificationCodeInstance['$props'];
  'color-picker': ColorPickerInstance['$props'];
}
// #endregion AcroDynamicFormField

export {
  AcroDynamicFormProps,
  AcroDynamicFormField,
  AcroDynamicFormComponentField,
};
