const unpkg = 'https://unpkg.com'; // https://unpkg.com/
const jsdelivr = 'https://cdn.jsdelivr.net/npm'; // https://www.jsdelivr.com/
const esmsh = 'https://esm.sh'; // https://esm.sh/
const cdnjs = 'https://cdnjs.cloudflare.com/ajax/libs'; // https://cdnjs.com/
const bootcdn = 'https://cdn.bootcdn.net/ajax/libs'; // https://www.bootcdn.cn/
const baomitu = 'https://lib.baomitu.com'; // https://cdn.baomitu.com/
const staticfile = 'https://cdn.staticfile.org'; // https://www.staticfile.org/

export interface GetFastestCDNOptions {
  /** 类库版本号 */
  version?: string;
  /** 用于检测用的文件地址 */
  file?: string;
}

/**
 * 获取在当前网络环境, 最快的 CDN 服务下的指定类库的根目录地址
 *
 * @see https://mixte.moomfe.com/mixte/snippets/getFastestCDN
 * @param pkg 类库名称
 * @param options 可选项
 */
export async function getFastestCDN(pkg: string, options?: GetFastestCDNOptions) {
  const { version, file } = options ?? {};
  const list: [string, string][] = [];

  const pkgVersion = `${pkg}${version ? `@${version}` : ''}`;
  const finalFile = file || '/package.json';

  const unpkgPkgRoot = `${unpkg}/${pkgVersion}`;
  const jsdelivrPkgRoot = `${jsdelivr}/${pkgVersion}`;
  const esmshPkgRoot = `${esmsh}/${pkgVersion}`;

  list.push(
    [unpkgPkgRoot, `${unpkgPkgRoot}${finalFile}`],
    [jsdelivrPkgRoot, `${jsdelivrPkgRoot}${finalFile}`],
    [esmshPkgRoot, `${esmshPkgRoot}${finalFile}`],
  );

  if (version) {
    const pkgVersion = `${pkg}/${version}`;

    const cdnjsPkgRoot = `${cdnjs}/${pkgVersion}`;
    const bootcdnPkgRoot = `${bootcdn}/${pkgVersion}`;
    const baomituPkgRoot = `${baomitu}/${pkgVersion}`;
    const staticfilePkgRoot = `${staticfile}/${pkgVersion}`;

    list.push(
      [cdnjsPkgRoot, `${cdnjsPkgRoot}${file || ''}`],
      [bootcdnPkgRoot, `${bootcdnPkgRoot}${file || ''}`],
      [baomituPkgRoot, `${baomituPkgRoot}${file || ''}`],
      [staticfilePkgRoot, `${staticfilePkgRoot}${file || ''}`],
    );
  }

  const controller = new AbortController();
  const fetchOptions = {
    method: 'get',
    signal: controller.signal,
  };

  const fastestCDN = await Promise.any(
    list.map(async ([CND, url]) => {
      return fetch(url, fetchOptions).then(async (res) => {
        if (res.ok) {
          // 这几个 CND 即使未找到资源, 也会返回 200 状态, 但是内容是 Not Found
          if (CND.startsWith(bootcdn) || CND.startsWith(baomitu) || CND.startsWith(staticfile)) {
            const text: string = await res.text();

            // 'File Not Found'
            // '404: Not Found'
            if (text.length < 15 && text.endsWith('Not Found'))
              throw new Error(CND);
          }

          return CND;
        };

        throw new Error(CND);
      });
    }),
  );

  controller.abort();

  return fastestCDN;
}
