import type { WelcomeProps } from '@ant-design/x';
import { Welcome } from '@ant-design/x';
import { renderVueCompOrSlot, type VueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import React from 'react';

interface Props extends Omit<WelcomeProps, 'description' | 'extra' | 'icon' | 'title'> {
  description?: VueCompOrSlot<string>;
  extra?: VueCompOrSlot<string>;
  icon?: VueCompOrSlot<string>;
  title?: VueCompOrSlot<string>;
}

export default function (props: Props) {
  const {
    description,
    extra,
    icon,
    title,
  } = props;

  const descriptionNode = React.useMemo(() => renderVueCompOrSlot(description), [description]);
  const extraNode = React.useMemo(() => renderVueCompOrSlot(extra), [extra]);
  const iconNode = React.useMemo(() => renderVueCompOrSlot(icon), [icon]);
  const titleNode = React.useMemo(() => renderVueCompOrSlot(title), [title]);

  return (
    <Welcome
      {...props}
      description={descriptionNode}
      extra={extraNode}
      icon={iconNode}
      title={titleNode}
    />
  );
}
