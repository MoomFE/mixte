import type { ExtractPropTypes } from 'vue-demi';
import AutoGrid, { autoGridProps } from './src/index';

export {
  AutoGrid as MixteAutoGrid,
  autoGridProps as mixteAutoGridProps,
};

export type MixteAutoGridProps = ExtractPropTypes<typeof autoGridProps>;
