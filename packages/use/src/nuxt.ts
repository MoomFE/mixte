import type { ModuleOptions, NuxtModule } from '@nuxt/schema';
import { defineNuxtModule } from '@nuxt/kit';
import { functions, vueuseFunctions } from './metadata';

interface MixteUseModuleOptions extends ModuleOptions {
  /** 自动导入 @mixte/use 中的方法 */
  autoImports?: boolean;
}

const nuxtModule: NuxtModule<MixteUseModuleOptions, MixteUseModuleOptions, false> = defineNuxtModule<MixteUseModuleOptions>({
  meta: {
    name: '@mixte/use',
    configKey: 'mixteUse',
  },
  defaults: {
    autoImports: true,
  },
  setup(options, nuxt) {
    if (options.autoImports) {
      nuxt.hook('imports:sources', (presets) => {
        presets.push({
          from: '@mixte/use',
          imports: [
            ...vueuseFunctions,
            ...functions,
          ],
        });
      });
    }
  },
});

export default nuxtModule;
