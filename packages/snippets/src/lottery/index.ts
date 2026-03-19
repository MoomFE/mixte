type LotteryComponent = typeof import('./src/index.vue')['default'];
type LotteryConfigProviderComponent = typeof import('./src/config-provider.vue')['default'];

export { default as LotteryConfigProvider } from './src/config-provider.vue';

export type LotteryConfigProviderInstance = InstanceType<LotteryConfigProviderComponent>;
export type LotteryInstance = InstanceType<LotteryComponent>;

export { default as Lottery } from './src/index.vue';
export * from './src/types';
