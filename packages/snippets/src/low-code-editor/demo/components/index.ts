import type { ComponentConfig, ComponentInfo } from '@mixte/snippets/low-code-editor/types';
import type { DefineComponent } from 'vue';
import { transformPathRecord } from '@mixte/snippets/low-code-editor/utils';

const configFiles = import.meta.glob('./*/config.ts', { eager: true });

/** 组件配置信息 */
const configs = transformPathRecord<ComponentConfig<any>>(configFiles, v => v.config);
/** 组件配置组件 */
const componentsConfig = transformPathRecord<DefineComponent>(
  import.meta.glob('./*/config.vue', { eager: true }),
  v => v.default,
);

/** 组件 */
const components = transformPathRecord<DefineComponent>(
  import.meta.glob('./*/index.vue', { eager: true }),
  v => v.default,
);

/** 所有组件信息 */
export const componentsInfo = Object.fromEntries(
  Object.keys(configs).filter(k => !!components[k]).map((name) => {
    const info: ComponentInfo<any> = {
      config: configs[name],
      component: components[name],
      componentConfig: componentsConfig[name],
    };

    return [
      configs[name]!.name,
      info,
    ];
  }),
);

/** 分组枚举 */
export const groupEnum = {
  basic: '基础组件',
};
