import { packages } from '../meta/packages';
import { pureBuildDts } from './pure-build-dts';

(async () => {
  await pureBuildDts(packages);
})();
