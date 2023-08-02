import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetExtra } from 'unocss-preset-extra';

export default defineConfig({
  shortcuts: {
    // 容器
    'm-box': 'flex-(~ items-center justify-center) rounded',
    'm-box-b': 'flex-(~ items-center justify-center) rounded b-(1 solid neutral-3)',

    // 按钮
    'm-btn': 'h-9 m-box bg-teal-5 c-white rounded-1 p-3 disabled:cursor-not-allowed',

    // 输入框
    'm-input': 'lh-none b-(1 solid neutral-3 rounded-1) p-(2 x-3)',
    'm-input-sm': 'p-(1 x-1.5)',
  },

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
