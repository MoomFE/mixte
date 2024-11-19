import type { ElSelect, ISelectProps, SelectOptionProxy } from 'element-plus';
import type { SetOptional } from 'type-fest';

export type SelectInstance = InstanceType<typeof ElSelect>;

export type MelOptionProps = SetOptional<
  Pick<SelectOptionProxy, 'value' | 'label' | 'disabled'>,
  'disabled'
>;

export interface MelSelectProps extends /* @vue-ignore */ Partial<Omit<ISelectProps, 'modelValue'>> {
  /** 选项数据源 */
  options?: MelOptionProps[];
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
