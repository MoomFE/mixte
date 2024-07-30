import { defineNuxtModule } from '@nuxt/kit';
import { functions, vueuseFunctions } from './metadata';

export default defineNuxtModule({
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
          type: true,
          imports: [
            ...vueuseFunctions,
            ...functions,
          ],
        });
      });
    }
  },
});
