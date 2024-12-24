import type { OptionsApi, useOptionsApi } from '@mixte/mel-components/utils';
import type { ElSelect, ISelectProps, SelectOptionProxy } from 'element-plus';
import type { SetOptional } from 'type-fest';
import type { Ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

export type SelectInstance = ComponentExposed<typeof ElSelect>;

export type MelSelectOption = SetOptional<
  Pick<SelectOptionProxy, 'value' | 'label' | 'disabled'>,
  'disabled'
>;

export interface MelSelectProps extends /* @vue-ignore */ Partial<ISelectProps> {
  /** 数据源 */
  options?: MelSelectOption[];
  /** 请求数据源的方法或参数 */
  optionsApi?: OptionsApi<MelSelectOption>;
  /** 是否正在从远程获取数据 */
  loading?: boolean;
}

export interface MelSelectSlots {
  /**
   * 默认插槽, 可自定义渲染 option 组件列表
   */
  default?: () => void;
  /**
   * 下拉列表顶部的内容
   * @version 2.4.3
   */
  header?: () => void;
  /**
   * 下拉列表底部的内容
   * @version 2.4.3
   */
  footer?: () => void;
  /**
   * Select 组件头部内容
   */
  prefix?: () => void;
  /**
   * 无选项时的列表
   */
  empty?: () => void;
  /**
   * select 组件自定义标签内容
   * @version 2.5.0
   */
  tag?: () => void;
  /**
   * select 组件自定义 loading 内容
   * @version 2.5.2
   */
  loading?: () => void;
  /**
   * select 组件自定义标签内容
   * @version 2.7.4
   */
  label?: () => void;
}

export type MelSelectExpose = {
  selectRef: Ref<SelectInstance | undefined>;
  api: ReturnType<typeof useOptionsApi>['api'];
} & {
  /** 使选择器的输入框获取焦点 */
  focus: SelectInstance['focus'];
  /** 使选择器的输入框失去焦点，并隐藏下拉框 */
  blur: SelectInstance['blur'];
  /** 获取当前选中的标签 */
  selectedLabel: SelectInstance['selectedLabel'];
};
