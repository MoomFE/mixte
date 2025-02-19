import type { Alias } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const alias: Alias[] = [
  { find: 'mixte', replacement: resolve(__dirname, '../packages/mixte/src/index') },
  { find: '@mixte/use/register', replacement: resolve(__dirname, '../packages/use/src/register') },
  { find: '@mixte/use/nuxt', replacement: resolve(__dirname, '../packages/use/src/nuxt') },
  { find: '@mixte/use', replacement: resolve(__dirname, '../packages/use/src/index') },
  { find: /^@mixte\/components\/(.*)$/, replacement: resolve(__dirname, '../packages/components/src/$1/index') },
  { find: '@mixte/validator', replacement: resolve(__dirname, '../packages/validator/src/index') },

  {
    find: /^@mixte\/snippets\/tiptap-editor\/(config-provider-Injection-state|icons)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/tiptap-editor/src/$1'),
  },
  {
    find: /^@mixte\/snippets\/lottery\/(config-provider-Injection-state|utils)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/lottery/src/$1'),
  },
  {
    find: /^@mixte\/snippets\/ant-design-x\/(init-veaury|flag)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/ant-design-x/src/$1'),
  },
  {
    find: /^@mixte\/snippets\/low-code-editor\/(config-provider-Injection-state|types|utils)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/low-code-editor/src/$1'),
  },

  {
    find: /^@mixte\/snippets\/dist\/(tiptap-editor|lottery|low-code-editor)\/css\/(.*)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/$1/src/css/$2'),
  },
  {
    find: /^@mixte\/snippets\/(tiptap-editor|lottery|ant-design-x|low-code-editor)\/(.*)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/$1/$2'),
  },

  { find: /^@mixte\/snippets\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/src/$1/index') },
  { find: /^@mixte\/mel-components\/(.*)$/, replacement: resolve(__dirname, '../packages/mel-components/src/$1/index') },
];

export const testAlias: Alias[] = [
  { find: 'mixte', replacement: resolve(__dirname, '../packages/mixte/dist/index') },
  { find: '@mixte/use/register', replacement: resolve(__dirname, '../packages/use/dist/register') },
  { find: '@mixte/use/nuxt', replacement: resolve(__dirname, '../packages/use/dist/nuxt') },
  { find: '@mixte/use', replacement: resolve(__dirname, '../packages/use/dist/index') },
  { find: /^@mixte\/components\/(.*)$/, replacement: resolve(__dirname, '../packages/components/dist/$1') },
  { find: '@mixte/validator', replacement: resolve(__dirname, '../packages/validator/dist/index') },
  {
    find: /^@mixte\/snippets\/dist\/(tiptap-editor|lottery|low-code-editor)\/css\/(.*)$/,
    replacement: resolve(__dirname, '../packages/snippets/dist/$1/css/$2'),
  },
  {
    find: /^@mixte\/snippets\/(tiptap-editor|lottery|ant-design-x|low-code-editor)\/(.*)$/,
    replacement: resolve(__dirname, '../packages/snippets/dist/$1/$2'),
  },
  { find: /^@mixte\/snippets\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/dist/$1') },
  { find: /^@mixte\/mel-components\/(.*)$/, replacement: resolve(__dirname, '../packages/mel-components/dist/$1') },
];
