import { defineComponentConfig } from '@mixte/snippets/low-code-editor/utils';

export interface Config {
  /** 文本 */
  text?: string;
}

export const config = defineComponentConfig<Config>({
  name: 'LayoutDiv',
  displayName: '容器',
  group: 'basic',
  config: {

  },
});
