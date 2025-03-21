import type { SenderHeaderProps } from '@ant-design/x/es/sender/SenderHeader';
import { Sender } from '@ant-design/x';

export default function (props: SenderHeaderProps) {
  return (
    <Sender.Header
      {...props}
    />
  );
}
