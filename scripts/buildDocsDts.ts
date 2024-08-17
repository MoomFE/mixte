import { packages } from '../meta/packages';
import { pureBuildDts } from './pure-build-dts';

(async () => {
  await pureBuildDts(
    packages.filter((info) => {
      // vitepress 中的 twoslash 似乎不能访问 .vue 文件中的类型, 导致文档上的类型无法正确显示
      // 这里单独构建一份 d.ts 文件
      return info.vueComponent
      // 通过 exports 的方式导出的模块也需要单独构建 d.ts 文件
        || info.outputFileName === 'toggleThemeViewTransition';
    }),
  );
})();
