import type { OptionsApiConfig, OptionsApiRequest } from '@mixte/mel-components/utils';
import type { ElSelect, SelectOptionProxy, SelectProps } from 'element-plus';
import type { SetOptional } from 'type-fest';
import type { MaybeRefOrGetter, VNodeChild } from 'vue';

export type SelectInstance = InstanceType<typeof ElSelect>;

export type MelSelectOption = SetOptional<
  Pick<SelectOptionProxy, 'value' | 'label' | 'disabled'>,
  'disabled'
> & {
  render?: (option: MelSelectOption) => VNodeChild;
  [key: string]: any;
};

// #region SelectOptionsApiConfig
export interface SelectOptionsApiConfig<T> extends OptionsApiConfig<T> {
  /**
   * 远程筛选时的字段名
   *  - 当 `filterable: true` 和 `remote: true` 时可用
   *  - 定义后则会在搜索时将输入值作为该字段的值传入 `api` 方法并发起请求
   */
  remoteKey?: string;
}
// #endregion SelectOptionsApiConfig
// #region SelectOptionsApi
export type SelectOptionsApi<T> = OptionsApiRequest<T> | SelectOptionsApiConfig<T>;
// #endregion SelectOptionsApi

export interface MelSelectProps extends /* @vue-ignore */ Omit<Partial<SelectProps>, 'loading' | 'filterable' | 'remote'> {
  /** 是否正在从远程获取数据 */
  loading?: boolean;
  /** Select 组件是否可筛选 */
  filterable?: boolean;
  /** 选项是否从服务器远程加载 */
  remote?: boolean;

  /** 数据源 */
  options?: MaybeRefOrGetter<MelSelectOption[]>;
  /** 请求数据源的方法或参数 */
  optionsApi?: SelectOptionsApi<MelSelectOption>;
  /**
   * 对数据源选项进行筛选时执行的方法, 返回 `false` 则表示这个选项会被隐藏
   *  - 方法第一个参数为启用 `filterable` 时的输入值, 若未启用则始终为 `''`
   *  - 方法第二个参数为当前筛选的选项数据
   */
  filterOptionMethod?: (query: string, option: MelSelectOption) => boolean | undefined;
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
   * 自定义渲染选项
   * @param option 选项数据
   * @version @mixte/mel-components@3.3.0
   */
  'option'?: (option: MelSelectOption) => void;
  /**
   * 自定义渲染选项内容 ( 仅内容部分, 而非整个选项 )
   * @param option 选项数据
   * @version @mixte/mel-components@3.3.0
   */
  'option-label'?: (option: MelSelectOption) => void;
  /**
   * 自定义渲染选项内容和标签
   *  - 自定义渲染选项内容 ( 仅内容部分, 而非整个选项, 和 `option-label` 的作用一致 )
   *  - 在未传入 label 插槽时代替 label 插槽来渲染标签
   * @param option 选项数据
   * @version @mixte/mel-components@3.3.0
   */
  'all-label'?: (option: MelSelectOption) => void;
}
