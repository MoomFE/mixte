import type { BubbleProps } from '@ant-design/x';
import type { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList';
import type { AvatarProps } from 'antd';
import type { RewriteBubbleListProps, RewriteBubbleProps, RewriteRolesType, RewriteRoleType } from '../types';
import { Bubble } from '@ant-design/x';
import { renderVueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import { assertPlainObject, isFunction } from 'mixte';
import React from 'react';

export default function (props: RewriteBubbleListProps) {
  const {
    roles,
    items,
  } = props;

  function transform(props: Pick<RewriteBubbleProps, 'avatar' | 'header' | 'footer' | 'content' | 'messageRender'>) {
    const avatar = assertPlainObject<AvatarProps>(props.avatar)
      ? {
          ...props.avatar,
          icon: renderVueCompOrSlot(props.avatar.icon),
        }
      : renderVueCompOrSlot(props.avatar);
    const header = renderVueCompOrSlot(props.header);
    const footer = renderVueCompOrSlot(props.footer);
    const content = renderVueCompOrSlot(props.content);
    const messageRender = isFunction(props.messageRender)
      ? (content: string) => renderVueCompOrSlot(props.messageRender!(content))
      : undefined;

    return {
      ...(avatar === undefined ? {} : { avatar }),
      ...(header === undefined ? {} : { header }),
      ...(footer === undefined ? {} : { footer }),
      ...(content === undefined ? {} : { content }),
      ...(messageRender === undefined ? {} : { messageRender }),
    };
  }

  const finalItems = React.useMemo((): BubbleListProps['items'] => {
    return items?.map((item) => {
      return {
        ...item as BubbleProps,
        ...transform(item),
      };
    });
  }, [items]);

  const finalRoles = React.useMemo((): BubbleListProps['roles'] => {
    if (assertPlainObject<RewriteRolesType>(roles)) {
      return Object.fromEntries(
        Object.entries(roles).map(([key, role]: [string, RewriteRoleType]) => {
          return [
            key,
            {
              ...role as BubbleProps,
              ...transform(role),
            },
          ];
        }),
      );
    }

    // todo
    return roles as any;
  }, [roles]);

  return (
    <Bubble.List
      {...props}
      items={finalItems}
      roles={finalRoles}
    />
  );
}
