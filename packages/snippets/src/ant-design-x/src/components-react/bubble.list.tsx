import type { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList';
import type { AvatarProps } from 'antd';
import type { RewriteRolesType, RewriteRoleType } from '../types';
import { Bubble } from '@ant-design/x';
import { renderVueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import { assertPlainObject, isFunction } from 'mixte';
import React from 'react';

interface Props extends Omit<BubbleListProps, 'roles'> {
  roles?: RewriteRolesType;
}

export default function (props: Props) {
  const { roles } = props;

  const finalRoles = React.useMemo(() => {
    if (assertPlainObject<RewriteRolesType>(roles)) {
      return Object.fromEntries(
        Object.entries(roles).map(([key, role]: [string, RewriteRoleType]) => {
          return [
            key,
            {
              ...role,
              avatar: assertPlainObject<AvatarProps>(role.avatar)
                ? {
                    ...role.avatar,
                    icon: renderVueCompOrSlot(role.avatar.icon),
                  }
                : renderVueCompOrSlot(role.avatar),
              header: renderVueCompOrSlot(role.header),
              footer: renderVueCompOrSlot(role.footer),
              messageRender: isFunction(role.messageRender)
                ? (content: string) => renderVueCompOrSlot(role.messageRender!(content))
                : undefined,
            },
          ];
        }),
      );
    }

    return roles;
  }, [roles]);

  return (
    <Bubble.List
      {...props}
      roles={finalRoles}
    />
  );
}
