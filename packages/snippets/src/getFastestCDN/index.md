---
outline: [1,3]
---

获取在当前网络环境, 最快的 CDN 服务下的指定类库的根目录地址

::: info CDN 服务
  目前使用的全部 CDN 服务为:  [unpkg], [jsdelivr], [esm.sh], [cdnjs], [bootcdn], [staticfile]

  这些 CDN 可以分为两类:

  ---

  > [unpkg], [jsdelivr], [esm.sh]
  > - 拥有所有 [npmjs] 上的类库, 及类库中的所有文件及文件夹层级
  > - 访问类库时, 可以不指定版本号

  ---

  > [cdnjs], [bootcdn], [staticfile]
  > - 存储着部分类库的文件及文件夹层级
  > - 访问类库必须指定版本号
:::

::: info 可选项说明 ( `version` 和 `file` )
  当未提供 `version` 时, 将会同时使用 [unpkg], [jsdelivr], [esm.sh] 的 CDN 服务.<br>
  当提供了 `version` 时, 将会同时使用 [unpkg], [jsdelivr], [esm.sh], [cdnjs], [bootcdn], [staticfile] 的 CDN 服务.

  当未提供 `file` 时, [unpkg], [jsdelivr], [esm.sh] 将会默认请求 `/package.json` 文件.<br>
  而 [cdnjs], [bootcdn], [staticfile] 将会请求类库根目录.
:::

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
[staticfile]: https://www.staticfile.org/
[npmjs]: https://www.npmjs.com/