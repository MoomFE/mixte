import type { ImportsMap } from 'unplugin-auto-import/types';

/**
 * 按需导入
 *  - 供 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 使用
 *
 * @example
 *
 * import AutoImport from 'unplugin-auto-import/vite';
 * import { MixteUseAutoImport } from '@mixte/use/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     AutoImport({
 *       imports: [MixteUseAutoImport()]
 *     }),
 *   ],
 * })
 */
export function MixteUseAutoImport(): ImportsMap {
  return {
    '@mixte/use': [
      'watchDeep',
      'watchImmediate',
      'watchImmediateDeep',
      'whenever',
      'wheneverDeep',
      'wheneverEffectScope',
      'wheneverEffectScopeImmediate',
      'wheneverImmediate',
      'wheneverImmediateDeep',
    ],
  };
}
