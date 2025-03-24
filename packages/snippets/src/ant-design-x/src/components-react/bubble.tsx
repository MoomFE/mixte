import type { AvatarProps } from 'antd';
import type { RewriteBubbleProps } from '../types';
import { Bubble } from '@ant-design/x';
import { renderVueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import { assertPlainObject, isFunction } from 'mixte';
import React from 'react';

export default function (props: RewriteBubbleProps) {
  const {
    avatar,
    header,
    footer,
    messageRender,
  } = props;

  const finalAvatar = React.useMemo(() => {
    if (assertPlainObject<AvatarProps>(avatar) && avatar.icon) {
      return {
        ...avatar,
        icon: renderVueCompOrSlot(avatar.icon),
      };
    }

    return renderVueCompOrSlot(avatar);
  }, [avatar]);

  const finalHeader = React.useMemo(() => renderVueCompOrSlot(header), [header]);
  const finalFooter = React.useMemo(() => renderVueCompOrSlot(footer), [footer]);

  const finalMessageRender = React.useMemo(() => {
    if (isFunction(messageRender)) {
      return (content: string) => renderVueCompOrSlot(messageRender(content));
    }
  }, [messageRender]);

  return (
    <Bubble
      {...props}
      avatar={finalAvatar}
      header={finalHeader}
      footer={finalFooter}
      messageRender={finalMessageRender}
    />
  );
}
