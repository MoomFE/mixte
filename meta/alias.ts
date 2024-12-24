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
  { find: /^@mixte\/snippets\/dist\/tiptap-editor\/css\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/src/tiptap-editor/src/css/$1') },
  {
    find: /^@mixte\/snippets\/tiptap-editor\/(config-provider-Injection-state|icons)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/tiptap-editor/src/$1'),
  },
  {
    find: /^@mixte\/snippets\/tiptap-editor\/(.*)$/,
    replacement: resolve(__dirname, '../packages/snippets/src/tiptap-editor/$1'),
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
  { find: /^@mixte\/snippets\/dist\/tiptap-editor\/css\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/dist/tiptap-editor/css/$1') },
  {
    find: /^@mixte\/snippets\/tiptap-editor\/(.*)$/,
    replacement: resolve(__dirname, '../packages/snippets/dist/tiptap-editor/$1'),
  },
  { find: /^@mixte\/snippets\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/dist/$1') },
  { find: /^@mixte\/mel-components\/(.*)$/, replacement: resolve(__dirname, '../packages/mel-components/dist/$1') },
];
