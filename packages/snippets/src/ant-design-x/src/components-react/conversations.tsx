import type { Conversation, ConversationsProps } from '@ant-design/x/es/conversations';
import type { ItemType } from 'antd/es/menu/interface';
import type { RewriteConversation, RewriteConversationsProps } from '../types';
import { Conversations } from '@ant-design/x';
import { renderVueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import { isFunction, isPlainObject } from 'mixte';
import React from 'react';

export default function (props: RewriteConversationsProps) {
  const {
    items,
    menu,
  } = props;

  const finalItems = React.useMemo(() => {
    return items?.map((item): Conversation => {
      return {
        ...item,
        key: item.key,
        label: renderVueCompOrSlot(item.label),
        icon: renderVueCompOrSlot(item.icon),
      };
    });
  }, [items]);

  const finalMenu = React.useMemo((): ConversationsProps['menu'] => {
    if (isFunction(menu)) {
      return (value: Conversation) => {
        const result = menu(value as RewriteConversation);

        return {
          ...result,
          items: result.items?.map((item) => {
            return {
              ...item as ItemType,
              icon: renderVueCompOrSlot(item.icon) as any,
            };
          }) as ItemType[],
        };
      };
    }
    else if (isPlainObject(menu)) {
      return {
        ...menu,
        items: menu.items?.map((item) => {
          return {
            ...item as ItemType,
            icon: renderVueCompOrSlot(item.icon) as any,
          };
        }) as ItemType[],
      };
    }
  }, [menu]);

  return (
    <Conversations
      {...props}
      items={finalItems}
      menu={finalMenu}
    />
  );
}
