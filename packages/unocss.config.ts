import { fileURLToPath } from 'node:url';
import { dataToEsm } from '@rollup/pluginutils';
import { outputFileSync } from 'fs-extra';
import { dirname, resolve } from 'pathe';
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetExtra } from 'unocss-preset-extra';
import { presetScrollbar } from 'unocss-preset-scrollbar';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  shortcuts: {
    // 边框
    'm-theme-border': 'b-0 b-solid b-neutral-2 dark:b-neutral-2/36',

    // 容器
    'm-box': 'flex-(~ items-center justify-center) rounded',
    'm-box-b': 'flex-(~ items-center justify-center) rounded b-(1 solid neutral-3)',

    // 输入框
    'm-input': 'max-w-full lh-none b-(1 solid neutral-3 rounded-1) p-(2 x-3)',
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
    presetScrollbar(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  blocklist: [
    'container',
  ],
  extendTheme: (theme) => {
    // 始终生成一个 UnoCSS 主题样式配置文件, 方便在 JS 中引用
    outputFileSync(
      resolve(__dirname, './.vitepress/shared/unocss.theme.ts'),
      `/* eslint-disable */\n\n${dataToEsm(theme, {
        preferConst: true,
        indent: '  ',
        objectShorthand: true,
      })}`,
    );
  },
});
