/**
 * 函数/组件的描述信息
 */
export interface Info {
  /** 函数/组件的文件路径 */
  readonly fn: string;
  /** 标题 */
  title?: string;
  /** 中文名 / 简称 ( 显示到文档侧边栏及文档大标题中 ) */
  name?: string;
  /** 是否隐藏文档大标题 */
  hiddenTitle?: boolean;
  /** 侧边栏标题 */
  sidebarTitle?: string;
}

export function defineDocInfo(info: Omit<Info, 'fn'>): Info {
  return info as Info;
}
