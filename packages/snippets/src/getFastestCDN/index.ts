const unpkg = 'https://unpkg.com'; // https://unpkg.com/
const jsdelivr = 'https://cdn.jsdelivr.net/npm'; // https://www.jsdelivr.com/
const esmsh = 'https://esm.sh'; // https://esm.sh/
const cdnjs = 'https://cdnjs.cloudflare.com/ajax/libs'; // https://cdnjs.com/
const bootcdn = 'https://cdn.bootcdn.net/ajax/libs'; // https://www.bootcdn.cn/
const staticfile = 'https://cdn.staticfile.org'; // https://www.staticfile.org/

export interface GetFastestCDNOptions {
  version?: string
  file?: string
}

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
    const staticfilePkgRoot = `${staticfile}/${pkgVersion}`;

    list.push(
      [cdnjsPkgRoot, `${cdnjsPkgRoot}${file || ''}`],
      [bootcdnPkgRoot, `${bootcdnPkgRoot}${file || ''}`],
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
      return fetch(url, fetchOptions).then((res) => {
        if (res.ok) return CND;
        throw new Error(CND);
      });
    }),
  );

  controller.abort();

  return fastestCDN;
}
