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

  /** 组件配置 */
  config: Config;
}

/** 组件信息 */
export interface ComponentInfo<Config extends Record<string, any>> {
  /** 组件配置 */
  config: ComponentConfig<Config>;
  /** 组件 */
  component: DefineComponent;
}

/** 全局配置组件传参 */
export interface LowCodeEditorProps<Config extends Record<string, any>> {
  /** 所有组件的信息 */
  componentsInfo?: ComponentInfo<Config>[];
  /** 组件列表 */
  componentList?: ComponentConfig<Config>[];
}
