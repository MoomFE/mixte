import type { BubbleProps } from '@ant-design/x';
import type { AvatarProps } from 'antd';
import { Bubble } from '@ant-design/x';
import { renderVueCompOrSlot, type VueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import { assertPlainObject } from 'mixte';
import React from 'react';

interface Props extends Omit<BubbleProps, 'avatar' | 'footer' | 'header'> {
  avatar?: VueCompOrSlot<AvatarProps>;
  footer?: VueCompOrSlot<string>;
  header?: VueCompOrSlot<string>;
}

export default function (props: Props) {
  const {
    avatar,
    header,
    footer,
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

  return (
    <Bubble
      {...props}
      avatar={finalAvatar}
      header={finalHeader}
      footer={finalFooter}
    />
  );
}
