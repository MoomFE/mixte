import { packages } from '../meta/packages';
import { pureBuildDts } from './pure-build-dts';

(async () => {
  // vitepress 中的 twoslash 似乎不能访问 .vue 文件中的类型, 导致文档上的类型无法正确显示
  // 这里单独构建一份 d.ts 文件
  await pureBuildDts(
    packages.filter(info => info.vueComponent),
  );
})();
