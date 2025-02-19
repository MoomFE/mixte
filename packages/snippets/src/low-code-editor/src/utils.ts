import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';

/**
 * 定义组件信息
 */
export function defineComponentConfig<Config extends Record<string, any>>(info: ComponentConfig<Config>) {
  return info;
}

/**
 * 将基于路径的对象转换为具有自定义键和值处理的新对象
 * @param record 原始对象，其键为路径
 * @param valueTransformer 处理每个值的函数
 * @param keyExtractor 从路径派生新键的函数
 * @returns 转换后的对象
 */
export function transformPathRecord<T>(
  record: Record<string, any>,
  valueTransformer = (v: any) => v,
  keyExtractor = (path: string) => path.split('/').reverse()[1],
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).map(([path, value]) => {
      return [
        keyExtractor(path),
        valueTransformer(value),
      ];
    }),
  );
}
