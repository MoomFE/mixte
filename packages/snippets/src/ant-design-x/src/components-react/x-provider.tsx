import { XProvider, type XProviderProps } from '@ant-design/x';

interface Props extends XProviderProps {

}

export default function (props: Props) {
  return (
    <XProvider
      {...props}
    />
  );
}
