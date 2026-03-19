type LowCodeEditorPreviewComponent = typeof import('./src/preview.vue')['default'];

export type LowCodeEditorPreviewInstance = InstanceType<LowCodeEditorPreviewComponent>;

export { default as LowCodeEditorPreview } from './src/preview.vue';
