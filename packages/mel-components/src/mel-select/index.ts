type MelSelectComponent = typeof import('./src/index.vue')['default'];

export { default as MelSelect } from './src/index.vue';

export type MelSelectInstance = InstanceType<MelSelectComponent>;

export type {
  MelSelectOption,
  MelSelectProps,
} from './src/types';
