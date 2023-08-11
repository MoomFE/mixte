import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetExtra } from 'unocss-preset-extra';

export default defineConfig({
  shortcuts: {
    // 容器
    'm-box': 'flex-(~ items-center justify-center) rounded',
    'm-box-b': 'flex-(~ items-center justify-center) rounded b-(1 solid neutral-3)',

    // 按钮
    'm-btn': 'm-box flex-none rounded-1 p-(1.5 x-3) transition-color hover:c-teal-5 active:c-teal-6 disabled:cursor-not-allowed',
    'm-btn-primary': 'bg-teal-5 c-white! not-disabled:hover:bg-teal-5/80 not-disabled:active:bg-teal-6/90',

    // 输入框
    'm-input': 'lh-none b-(1 solid neutral-3 rounded-1) p-(2 x-3)',
    'm-input-sm': 'p-(1 x-1.5)',

    // 弹出框
    'm-popover': 'text-sm bg-black c-white rounded transition-transform p-(.5 x2)',
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
