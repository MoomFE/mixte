import type { WelcomeProps } from '@ant-design/x';
import type { VueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import { Welcome } from '@ant-design/x';
import { renderVueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import React from 'react';

interface Props extends Omit<WelcomeProps, 'description' | 'extra' | 'icon' | 'title'> {
  description?: VueCompOrSlot;
  extra?: VueCompOrSlot;
  icon?: VueCompOrSlot;
  title?: VueCompOrSlot;
}

export default function (props: Props) {
  const {
    description,
    extra,
    icon,
    title,
  } = props;

  const finalDescription = React.useMemo(() => renderVueCompOrSlot(description), [description]);
  const finalExtra = React.useMemo(() => renderVueCompOrSlot(extra), [extra]);
  const finalIcon = React.useMemo(() => renderVueCompOrSlot(icon), [icon]);
  const finalTitle = React.useMemo(() => renderVueCompOrSlot(title), [title]);

  return (
    <Welcome
      {...props}
      description={finalDescription}
      extra={finalExtra}
      icon={finalIcon}
      title={finalTitle}
    />
  );
}
