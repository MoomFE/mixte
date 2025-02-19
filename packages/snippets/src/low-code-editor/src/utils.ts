import type { ComponentInfo } from '@mixte/snippets/low-code-editor/types';

/**
 * 定义组件信息
 */
export function defineComponentInfo<Config extends Record<string, any>>(info: ComponentInfo<Config>) {
  return info;
}
