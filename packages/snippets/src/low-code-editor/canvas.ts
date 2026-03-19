type LowCodeEditorCanvasComponent = typeof import('./src/canvas.vue')['default'];

export type LowCodeEditorCanvasInstance = InstanceType<LowCodeEditorCanvasComponent>;

export { default as LowCodeEditorCanvas } from './src/canvas.vue';
