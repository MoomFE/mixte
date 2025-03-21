import { Sender, type SenderProps } from '@ant-design/x';
import { renderVueCompOrSlot, type VueCompOrSlot } from '@mixte/snippets/ant-design-x/utils';
import React from 'react';

interface Props extends Omit<SenderProps, 'header' | 'prefix'> {
  header?: VueCompOrSlot;
  prefix?: VueCompOrSlot;
}

export default function (props: Props) {
  const {
    header,
    prefix,
  } = props;

  const finalHeader = React.useMemo(() => renderVueCompOrSlot(header), [header]);
  const finalPrefix = React.useMemo(() => renderVueCompOrSlot(prefix), [prefix]);

  return (
    <Sender
      {...props}
      header={finalHeader}
      prefix={finalPrefix}
    />
  );
}
