import type { ComponentExposed } from 'vue-component-type-helpers';

type LowCodeEditorConfigProviderComponent = typeof import('./src/config-provider.vue')['default'];

export type LowCodeEditorConfigProviderInstance = ComponentExposed<LowCodeEditorConfigProviderComponent>;

export { default as LowCodeEditorConfigProvider } from './src/config-provider.vue';
