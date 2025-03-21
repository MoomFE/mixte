import type { Conversation } from '@ant-design/x/es/conversations';
import type { RewriteConversationsProps } from '../types';
import { Conversations } from '@ant-design/x';
import { renderVueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import React from 'react';

export default function (props: RewriteConversationsProps) {
  const {
    items,
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

  return (
    <Conversations
      {...props}
      items={finalItems}
    />
  );
}
