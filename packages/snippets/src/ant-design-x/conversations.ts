import type { RewriteConversation } from './src/types';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

type ConversationsComponent = typeof import('./src/conversations.vue')['default'];

export type ConversationsInstance = InstanceType<ConversationsComponent>;

export type ConversationsProps = InstanceType<ConversationsComponent>['$props'];

export type Conversation = RewriteConversation;

export { default as Conversations } from './src/conversations.vue';
