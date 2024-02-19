---
outline: [1,4]
---

获取在当前网络环境, 最快的 CDN 服务下的指定类库的根目录地址

::: info CDN 服务
  目前使用的全部 CDN 服务为:  [unpkg], [jsdelivr], [esm.sh], [cdnjs], [bootcdn], [baomitu], [staticfile]

  这些 CDN 可以分为两类:

  ---

  > [unpkg], [jsdelivr], [esm.sh]
  > - 拥有所有 [npmjs] 上的类库, 及类库中的所有文件及文件夹层级
  > - 访问类库时, 可以不指定版本号

  ---

  > [cdnjs], [bootcdn], [baomitu], [staticfile]
  > - 存储着部分类库的文件及文件夹层级
  > - 访问类库必须指定版本号
:::

::: info 可选项说明
  - version:

  > 当未提供 `version` 时, 将仅使用 [unpkg], [jsdelivr], [esm.sh] 的 CDN 服务<br>
  > 当提供了 `version` 时, 将会同时使用全部 CDN 服务

  - file:

  > 当未提供 `file` 时, [unpkg], [jsdelivr], [esm.sh] 将会默认请求 `/package.json` 文件<br>
  > 而 [cdnjs], [bootcdn], [baomitu], [staticfile] 将会请求类库根目录
:::

### 示例

<br>

#### 和 [`@monaco-editor/loader`](https://github.com/suren-atoyan/monaco-loader) 一起使用

```ts {4,5,6,7,,11}
import loader from '@monaco-editor/loader';
import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

const fastestCDN = await getFastestCDN('monaco-editor', {
  version: '0.43.0',
  file: '/min/vs/basic-languages/yaml/yaml.js'
});

loader.config({
  paths: {
    vs: `${fastestCDN}/min/vs`,
  },
});

loader.init().then((monaco) => {
  // ...
});
```

#### 和 [`shiki`](https://github.com/shikijs/shiki) 一起使用, 加载主题和语言

::: warning
该方式仅限于版本 `<= v0.14.6` 使用, 版本 `>= v1.0.0` 不再需要 `setCDN` 方法
:::

```ts {4,5,6,7,9}
import * as shiki from 'shiki';
import { getFastestCDN } from '@mixte/snippets/getFastestCDN';

const fastestCDN = await getFastestCDN('shiki', {
  version: '0.14.5',
  file: '/languages/html.tmLanguage.json'
});

shiki.setCDN(`${fastestCDN}/`);

shiki.getHighlighter({
  langs: ['ts', 'vue'],
  theme: 'material-theme-darker',
}).then((highlighter) => {
  // ...
});
```

### 类型

```ts
interface GetFastestCDNOptions {
  /** 类库版本号 */
  version?: string
  /** 用于检测用的文件地址 */
  file?: string
}

/**
 * @param pkg 类库名称
 * @param options 可选项
 */
function getFastestCDN(pkg: string, options?: GetFastestCDNOptions): Promise<string>;
```

[unpkg]: https://unpkg.com/
[jsdelivr]: https://www.jsdelivr.com/
[esm.sh]: https://esm.sh/
[cdnjs]: https://cdnjs.com/
[bootcdn]: https://www.bootcdn.cn/
[baomitu]: https://cdn.baomitu.com/
[staticfile]: https://www.staticfile.org/
[npmjs]: https://www.npmjs.com/