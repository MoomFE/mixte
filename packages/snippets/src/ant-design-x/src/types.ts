// welcome

export const welcomeSlots = ['description', 'extra', 'icon', 'title'] as const;

export interface WelcomeSlots {
  /** 显示在提示列表中的描述 */
  description?: () => any;
  /** 显示在提示列表末尾的额外操作 */
  extra?: () => any;
  /** 显示在提示列表前侧的图标 */
  icon?: () => any;
  /** 显示在提示列表顶部的标题 */
  title?: () => any;
}

// x-provider

export const xProviderSlots = ['default'] as const;

export interface XProviderSlots {
  default?: () => any;
}
