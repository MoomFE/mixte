import type { ComponentExposed } from 'vue-component-type-helpers';
import Scrollbar from './src/index.vue';
import '@mixte/components/dist/scrollbar/css/index.scss';

export {
  useShared as useScrollbarInject,
} from './src/composables/useShared';

export type MixteScrollbarInstance = ComponentExposed<typeof Scrollbar>;

export type {
  ScrollbarProps as MixteScrollbarProps,
} from './src/types';

export {
  Scrollbar as MixteScrollbar,
};
