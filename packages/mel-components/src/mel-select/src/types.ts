import type { OptionsApi } from '@mixte/mel-components/utils';
import type { ElSelect, ISelectProps, SelectOptionProxy } from 'element-plus';
import type { SetOptional } from 'type-fest';
import type { VNodeChild } from 'vue';

export type SelectInstance = InstanceType<typeof ElSelect>;

export type MelSelectOption = SetOptional<
  Pick<SelectOptionProxy, 'value' | 'label' | 'disabled'>,
  'disabled'
> & {
  render?: (option: MelSelectOption) => VNodeChild;
};

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
  'default'?: () => void;
  /**
   * 下拉列表顶部的内容
   * @version element-plus@2.4.3
   */
  'header'?: () => void;
  /**
   * 下拉列表底部的内容
   * @version element-plus@2.4.3
   */
  'footer'?: () => void;
  /**
   * Select 组件头部内容
   */
  'prefix'?: () => void;
  /**
   * 无选项时的列表
   */
  'empty'?: () => void;
  /**
   * select 组件自定义标签内容
   * @version element-plus@2.5.0
   */
  'tag'?: () => void;
  /**
   * select 组件自定义 loading 内容
   * @version element-plus@2.5.2
   */
  'loading'?: () => void;
  /**
   * select 组件自定义标签内容
   * @version element-plus@2.7.4
   */
  'label'?: () => void;
  /**
   * 自定义渲染单个选项
   * @param option 选项数据
   * @version @mixte/mel-components@3.3.0
   */
  'option'?: (option: MelSelectOption) => void;
  /**
   * 自定义渲染选项内容 ( 仅内容部分，而非整个选项 )
   * @param option 选项数据
   * @version @mixte/mel-components@3.3.0
   */
  'option-label'?: (option: MelSelectOption) => void;
}
