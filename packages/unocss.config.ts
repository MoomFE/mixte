import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetExtra } from 'unocss-preset-extra';

export default defineConfig({
  shortcuts: [
    {
      'm-box': 'flex-(~ items-center justify-center) rounded',
      'm-box-b': 'flex-(~ items-center justify-center) rounded b-(1 solid neutral-3)',
    },
  ],
  presets: [
    presetUno(),
    presetAttributify({
      prefix: 'un:',
    }),
    presetIcons(),
    presetExtra(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
