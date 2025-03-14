import { createRoot } from 'react-dom/client';
import { setVeauryOptions } from 'veaury';
import '@ant-design/v5-patch-for-react-19';

setVeauryOptions({
  react: { createRoot },
});
