import type { RewriteConversation } from './src/types';
import Conversations from './src/conversations.vue';
import '@mixte/snippets/ant-design-x/patch-for-veaury';

export type ConversationsInstance = InstanceType<typeof Conversations>;

export type ConversationsProps = InstanceType<typeof Conversations>['$props'];

export type Conversation = RewriteConversation;

export {
  Conversations,
};
