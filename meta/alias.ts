import { resolve } from 'node:path';

export const alias = {
  'mixte': resolve(__dirname, '../packages/mixte/index'),
  '@mixte/use/resolvers': resolve(__dirname, '../packages/use/resolvers'),
  '@mixte/use': resolve(__dirname, '../packages/use/index'),
};

export const testAlias: Record<keyof typeof alias, string> = {
  'mixte': resolve(__dirname, '../packages/mixte/dist/index'),
  '@mixte/use/resolvers': resolve(__dirname, '../packages/use/dist/resolvers'),
  '@mixte/use': resolve(__dirname, '../packages/use/dist/index'),
};
