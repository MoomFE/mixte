import type { BubbleProps, ConversationsProps } from '@ant-design/x';
import type { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList';
import type { Conversation } from '@ant-design/x/es/conversations';
import type { SenderHeaderProps } from '@ant-design/x/es/sender/SenderHeader';
import type { VueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import type { AvatarProps } from 'antd';
import type { VNodeChild } from 'vue';

// welcome

export const welcomeSlots = ['description', 'extra', 'icon', 'title'] as const;

export interface WelcomeSlots {
  /** 显示在提示列表中的描述 */
  description?: () => any;
  /** 显示在提示列表末尾的额外操作 */
  extra?: () => any;
  /** 显示在提示列表前侧的图标 */
  icon?: () => any;
  /** 显示在提示列表顶部的标题 */
  title?: () => any;
}

// x-provider

export const xProviderSlots = ['default'] as const;

export interface XProviderSlots {
  default?: () => any;
}

// sender

export const senderSlots = ['header', 'prefix'] as const;

export interface SenderSlots {
  /** 头部面板 */
  header?: () => any;
  /** 前缀内容 */
  prefix?: () => any;
}

// sender header

export interface RewriteSenderHeaderProps extends /* @vue-ignore */ SenderHeaderProps {

}

// bubble

export interface RewriteAvatarProps extends Omit<AvatarProps, 'icon'> {
  icon?: VueCompOrSlot<AvatarProps['icon']>;
}

export interface RewriteBubbleProps extends /* @vue-ignore */ Omit<BubbleProps, 'avatar' | 'messageRender'> {
  avatar?: RewriteAvatarProps;
  messageRender?: (content: string) => VNodeChild;
}

export const bubbleSlots = ['avatar', 'footer', 'header'] as const;

export interface BubbleSlots {
  /** 展示头像 */
  avatar?: () => any;
  /** 底部内容 */
  footer?: () => any;
  /** 头部内容 */
  header?: () => any;
}

// bubble list

export type RewriteBubbleDataType = RewriteBubbleProps & {
  key?: string | number;
  role?: string;
};
export type RewriteRoleType = Partial<Omit<RewriteBubbleProps, 'content' | 'messageRender'>> & {
  messageRender?: (content: string) => VNodeChild;
};
export type RewriteRolesType = Record<string, RewriteRoleType>;

export interface RewriteBubbleListProps extends /* @vue-ignore */ Omit<BubbleListProps, 'roles'> {
  roles?: RewriteRolesType | ((bubbleDataP: RewriteBubbleDataType) => RewriteRoleType);
}

// Conversations

export type RewriteConversation = Omit<Conversation, 'label' | 'icon'> & {
  label?: VueCompOrSlot;
  icon?: VueCompOrSlot;
};

export type RewriteMenuProps = Omit<MenuProps, 'items'> & {
  items?: Omit<ItemType, 'icon'> & {
    icon?: VueCompOrSlot;
  }[];
};

export interface RewriteConversationsProps extends /* @vue-ignore */ Omit<ConversationsProps, 'items' | 'menu'> {
  items?: RewriteConversation[];
  menu?: RewriteMenuProps | ((value: RewriteConversation) => RewriteMenuProps);
}
