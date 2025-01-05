import LotteryConfigProvider from './src/config-provider.vue';
import Lottery from './src/index.vue';

export * from './src/types';

export type LotteryConfigProviderInstance = InstanceType<typeof LotteryConfigProvider>;
export type LotteryInstance = InstanceType<typeof Lottery>;

export {
  Lottery,
  LotteryConfigProvider,
};
