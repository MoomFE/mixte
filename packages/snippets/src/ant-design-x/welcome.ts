import Welcome from './src/welcome.vue';

export type WelcomeInstance = InstanceType<typeof Welcome>;

export type WelcomeProps = InstanceType<typeof Welcome>['$props'];

export {
  Welcome,
};
