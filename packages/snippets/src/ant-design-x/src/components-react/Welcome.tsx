import type { WelcomeProps } from '@ant-design/x';
import { Welcome as XWelcome } from '@ant-design/x';
import { isFunction } from 'mixte';
import React from 'react';

interface Props extends Omit<WelcomeProps, 'description' | 'extra' | 'icon' | 'title'> {
  description?: string | (() => React.ReactNode);
  extra?: string | (() => React.ReactNode);
  icon?: string | (() => React.ReactNode);
  title?: string | (() => React.ReactNode);
}

export default function (props: Props) {
  const {
    description,
    extra,
    icon,
    title,
  } = props;

  const descriptionNode = React.useMemo(() => {
    if (isFunction(description)) return description();
    return description;
  }, [description]);

  const extraNode = React.useMemo(() => {
    if (isFunction(extra)) return extra();
    return extra;
  }, [extra]);

  const iconNode = React.useMemo(() => {
    if (isFunction(icon)) return icon();
    return icon;
  }, [icon]);

  const titleNode = React.useMemo(() => {
    if (isFunction(title)) return title();
    return title;
  }, [title]);

  return (
    <XWelcome
      {...props}
      description={descriptionNode}
      extra={extraNode}
      icon={iconNode}
      title={titleNode}
    />
  );
}
