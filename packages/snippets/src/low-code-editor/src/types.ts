import type { DefineComponent } from 'vue';

/** 组件配置 */
export interface ComponentConfig<Config extends Record<string, any>> {
  /**
   * 组件 ID
   *  - 组件插入到页面中后会写入
   */
  id?: string;
  /**
   * 组件引用
   *  - 组件挂载后会写入
   */
  ref?: any;
  /** 组件名称 */
  name: string;
  /** 组件显示名称 */
  displayName: string;

  /** 组件分组 */
  group?: string;

  /** 组件配置 */
  config: Config;
}

/** 组件信息 */
export interface ComponentInfo<Config extends Record<string, any>> {
  /** 组件配置 */
  config: ComponentConfig<Config>;
  /** 组件配置组件 */
  componentConfig?: DefineComponent;
  /** 组件 */
  component: DefineComponent;
}

/** 全局配置组件传参 */
export interface LowCodeEditorProps<Config extends Record<string, any>> {
  /**
   * 组件列表
   *  - 组件编辑器需要双向绑定方式绑定
   */
  list?: ComponentConfig<Config>[];
  /** 所有组件的信息 */
  componentsInfo?: Record<string, ComponentInfo<Config>>;
  /**
   * 组件分组枚举
   *  - 组件编辑器才需要传
   */
  groupEnum?: Record<string, string>;
}
