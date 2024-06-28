import type { VNodeChild } from 'vue';
import type { AutoCompleteInstance, ButtonInstance, CascaderInstance, CascaderPanelInstance, CheckboxGroupInstance, CheckboxInstance, ColorPickerInstance, DatePickerInstance, FieldRule, FormInstance, FormItemInstance, InputGroupInstance, InputInstance, InputNumberInstance, InputPasswordInstance, InputSearchInstance, InputTagInstance, MentionInstance, MonthPickerInstance, QuarterPickerInstance, RadioGroupInstance, RadioInstance, RangePickerInstance, RateInstance, SelectInstance, SliderInstance, SpaceInstance, SwitchInstance, TextareaInstance, TimePickerInstance, TransferInstance, TreeSelectInstance, UploadInstance, VerificationCodeInstance, WeekPickerInstance, YearPickerInstance } from '@arco-design/web-vue';

interface AcroDynamicFormProps extends /* @vue-ignore */ Omit<FormInstance['$props'], 'model'> {
  /** 字段配置列表 */
  fields?: AcroDynamicFormField[];
  /** 表单数据 */
  model?: Record<string, any>;

  /**
   * 操作按钮区域配置
   *  - 传入 boolean 值时, 表示是否显示操作按钮区域
   * @default true
   */
  actionButtonArea?: ActionButtonAreaOptions | boolean;
  /**
   * 提交按钮配置
   *  - 传入 boolean 值时, 表示是否显示提交按钮
   * @default true
   */
  submitButton?: SubmitButtonOptions | boolean;
  /**
   * 重置按钮配置
   * - 传入 boolean 值时, 表示是否显示重置按钮
   * @default true
   */
  resetButton?: ResetButtonOptions | boolean;
}

interface AcroDynamicFormSlots {
  /** 操作按钮区域插槽, 可使用该插槽代替操作按钮区域的渲染 */
  actionButtonArea?: () => void;
  /** 操作按钮前置插槽, 可插入内容到提交按钮前面 */
  actionButtonPrepend?: () => void;
  /** 操作按钮后置插槽, 可插入内容到重置按钮后面 */
  actionButtonAppend?: () => void;
  /** 其他插槽 */
  [key: string]: ((options: RenderOptions) => void) | undefined;
}

// #region ActionButtonAreaOptions
/** 操作按钮区域配置 */
interface ActionButtonAreaOptions {
  /**
   * 是否显示操作按钮区域
   * @default true
   */
  show?: boolean;
  /** 传递给操作按钮区域 FormItem 组件的参数 */
  props?: FormItemInstance['$props'];
  /** 传递给操作按钮区域 Space 组件的参数 */
  spaceProps?: SpaceInstance['$props'];
}
// #endregion ActionButtonAreaOptions

// #region SubmitButtonOptions
/** 提交按钮配置 */
interface SubmitButtonOptions {
  /**
   * 是否显示提交按钮
   * @default true
   */
  show?: boolean;
  /**
   * 提交按钮文字
   * @default '提交'
   */
  text?: string;
  /** 传递给提交按钮组件的参数 */
  props?: ButtonInstance['$props'];
}
// #endregion SubmitButtonOptions

// #region ResetButtonOptions
/** 重置按钮配置 */
interface ResetButtonOptions {
  /**
   * 是否显示重置按钮
   * @default true
   */
  show?: boolean;
  /**
   * 重置按钮文字
   * @default '重置'
   */
  text?: string;
  /** 传递给重置按钮组件的参数 */
  props?: ButtonInstance['$props'];
}
// #endregion ResetButtonOptions

/** 组件渲染函数选项 */
interface RenderOptions {
  /** 表单数据 */
  model: Record<string, any>;
  /** 原组件渲染函数 */
  Component: () => VNodeChild;
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
  formItemSlots?: {
    /** 标签 */
    label?: () => VNodeChild;
    /** 帮助信息 */
    help?: () => VNodeChild;
    /** 额外内容 */
    extra?: () => VNodeChild;
    /** 其他插槽 ( 预留 ) */
    [key: string]: ((...args: any[]) => VNodeChild) | undefined;
  };
  /** 字段类型 */
  type?: string;
  /** 传递给组件的参数 */
  componentProps?: Record<string, any>;
  /** 传递给组件的插槽 */
  componentSlots?: Record<string, (...args: any[]) => VNodeChild>;
  /** 组件渲染函数或插槽名称 */
  render?: ((options: RenderOptions) => VNodeChild) | string;
  /** 预设 */
  preset?: symbol | symbol[];
}

/** 组件字段配置 */
type AcroDynamicFormComponentField = {
  [T in AcroDynamicFormFieldType]: Omit<AcroDynamicFormFieldBase, 'type' | 'componentProps'> & {
    /** 字段类型 */
    type: T;
    /** 传递给组件的参数 */
    componentProps?: Omit<AcroDynamicFormFieldComponentPropsMap[T], 'modelValue'>;
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

  ActionButtonAreaOptions,
  SubmitButtonOptions,
  ResetButtonOptions,

  AcroDynamicFormSlots,

  AcroDynamicFormField,
  AcroDynamicFormComponentField,
};
