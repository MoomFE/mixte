type TiptapEditorComponent = typeof import('./src/index.vue')['default'];

export { default as TiptapEditor } from './src/index.vue';

export type TiptapEditorInstance = InstanceType<TiptapEditorComponent>;

export type { TiptapEditorProps } from './src/types';
