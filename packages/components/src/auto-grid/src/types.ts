export {
  CommomAutoGridProps as AutoGridProps,
} from '../../list-auto-grid/src/composables/useAutoGrid';

export interface AutoGridSlots {
  overflowSuffix?: () => void;
  default?: () => void;
}
