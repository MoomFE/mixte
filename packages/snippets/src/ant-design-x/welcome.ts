import Welcome from './src/welcome.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type WelcomeInstance = InstanceType<typeof Welcome>;

export type WelcomeProps = InstanceType<typeof Welcome>['$props'];

export {
  Welcome,
};
