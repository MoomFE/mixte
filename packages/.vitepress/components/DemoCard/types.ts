import type { BundledLanguage } from 'shiki';

// 向子组件内注入的一些变量

export type InjectCode = Ref<string>;
export type InjectCodeLang = Ref<BundledLanguage>;
