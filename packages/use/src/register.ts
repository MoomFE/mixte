import type { ImportsMap } from 'unplugin-auto-import/types';

interface MixteUseAutoImportOptions {
  /**
   * 是否和 `@vueuse/core` 一起使用
   *  - 会排除与 `@vueuse/core` 功能相同且名称相同的方法
   *  - 例如 `watchDeep`, `watchImmediate`, `whenever` 等
   *
   * @default false
   */
  useWithVueUseCore?: boolean
}

/**
 * 按需导入
 *  - 供 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 使用
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
export function MixteUseAutoImport(options?: MixteUseAutoImportOptions): ImportsMap {
  const {
    useWithVueUseCore = false,
  } = options ?? {};

  return {
    '@mixte/use': [
      ...(
        useWithVueUseCore
          ? []
          : [
              'watchDeep',
              'watchImmediate',
              'whenever',
            ]
      ),
      'watchImmediateDeep',
      'wheneverDeep',
      'wheneverEffectScope',
      'wheneverEffectScopeImmediate',
      'wheneverEffectScopeDeep',
      'wheneverEffectScopeImmediateDeep',
      'wheneverImmediate',
      'wheneverImmediateDeep',
      'useCountdown',
      'deepUnref',
      'useRequest',
      'useRequestReactive',
      'createNamedSharedComposable',
    ],
  };
}
