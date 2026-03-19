type LowCodeEditorComponent = typeof import('./src/editor.vue')['default'];

export type LowCodeEditorInstance = InstanceType<LowCodeEditorComponent>;

export { default as LowCodeEditor } from './src/editor.vue';
