import type { InlinePreset } from 'unimport';
import { functions, vueuseFunctions } from './metadata.ts';

interface MixteUseAutoImportOptions {
  /**
   * 是否和 `@vueuse/core` 一起使用
   *  - 会排除与 `@vueuse/core` 功能相同且名称相同的方法
   *  - 例如 `watchDeep`, `watchImmediate`, `whenever` 等
   *
   * @default false
   */
  useWithVueUseCore?: boolean;
}

/**
 * 按需导入
 *  - 供 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 使用
 *  - 返回的 preset 带有高于默认值的 priority, 与 `@vueuse/core` 等存在同名方法时优先使用 `@mixte/use` 的实现 ( 如 `useCountdown` )
 *
 * @example
 *
 * import AutoImport from 'unplugin-auto-import/register';
 * import { MixteUseAutoImport } from '@mixte/use/register';
 *
 * export default defineConfig({
 *   plugins: [
 *     // 导入所有方法
 *     AutoImport({
 *       imports: [MixteUseAutoImport()]
 *     }),
 *     // 与 `@vueuse/core` 一起使用时
 *     AutoImport({
 *       imports: [
 *         '@vueuse/core',
 *         MixteUseAutoImport({ useWithVueUseCore: true }),
 *       ],
 *   ],
 * })
 */
export function MixteUseAutoImport(options?: MixteUseAutoImportOptions): InlinePreset {
  const {
    useWithVueUseCore = false,
  } = options ?? {};

  return {
    from: '@mixte/use',
    // 高于 unimport 默认的 1, 同名方法冲突时优先使用 `@mixte/use` 的实现
    priority: 2,
    imports: [
      ...(useWithVueUseCore ? [] : vueuseFunctions),
      ...functions,
    ],
  };
}
