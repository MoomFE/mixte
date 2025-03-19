import type { BubbleProps } from '@ant-design/x';
import type { AvatarProps } from 'antd';
import { Bubble } from '@ant-design/x';
import { isFunction, isPlainObject } from 'mixte';
import React from 'react';
import { applyPureVueInReact } from 'veaury';

interface Props extends Omit<BubbleProps, 'avatar' | 'footer' | 'header'> {
  avatar?: AvatarProps | (() => React.ReactNode);
  footer?: string | (() => React.ReactNode);
  header?: string | (() => React.ReactNode);
}

export default function (props: Props) {
  const {
    avatar,
    header,
    footer,
  } = props;

  const finalAvatar = React.useMemo<BubbleProps['avatar']>(() => {
    if (isFunction(avatar)) return avatar() as any;
    if (isPlainObject(avatar)) {
      const icon = (avatar as AvatarProps).icon;

      if (icon) {
        const Icon = applyPureVueInReact(icon);

        return {
          ...avatar,
          icon: <Icon />,
        };
      }
    }

    return avatar;
  }, [avatar]);

  const finalHeader = React.useMemo(() => {
    if (isFunction(header)) return header();
    return header;
  }, [header]);

  const finalFooter = React.useMemo(() => {
    if (isFunction(footer)) return footer();
    return footer;
  }, [footer]);

  return (
    <Bubble
      {...props}
      avatar={finalAvatar}
      header={finalHeader}
      footer={finalFooter}
    />
  );
}
