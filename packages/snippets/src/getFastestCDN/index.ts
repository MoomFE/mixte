const unpkg = 'https://unpkg.com'; // https://unpkg.com/
const jsdelivr = 'https://cdn.jsdelivr.net/npm'; // https://www.jsdelivr.com/
const esmsh = 'https://esm.sh'; // https://esm.sh/
const cdnjs = 'https://cdnjs.cloudflare.com/ajax/libs'; // https://cdnjs.com/
const bootcdn = 'https://cdn.bootcdn.net/ajax/libs'; // https://www.bootcdn.cn/
const baomitu = 'https://lib.baomitu.com'; // https://cdn.baomitu.com/
const bytedance = 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M'; // https://cdn.bytedance.com/
const staticfile = 'https://cdn.staticfile.org'; // https://www.staticfile.org/

export interface GetFastestCDNOptions {
  version?: string
  file?: string
}

export function getFastestCDN(pkg: string, options?: GetFastestCDNOptions) {
  const { version, file } = options ?? {};
  const list: Record<string, string>[] = [];

  const pkgVersion = `${pkg}${version ? `@${version}` : ''}`;
  const finalFile = file ?? 'package.json';

  const unpkgPkgRoot = `${unpkg}/${pkgVersion}`;
  const jsdelivrPkgRoot = `${jsdelivr}/${pkgVersion}`;
  const esmshPkgRoot = `${esmsh}/${pkgVersion}`;

  list.push(
    { [unpkgPkgRoot]: `${unpkgPkgRoot}/${finalFile}?meta` },
    { [jsdelivrPkgRoot]: `${jsdelivrPkgRoot}/${finalFile}` },
    { [esmshPkgRoot]: `${esmshPkgRoot}/${finalFile}` },
  );

  if (version && file) {
    const pkgVersion = `${pkg}/${version}`;

    const cdnjsPkgRoot = `${cdnjs}/${pkgVersion}`;
    const bootcdnPkgRoot = `${bootcdn}/${pkgVersion}`;
    const baomituPkgRoot = `${baomitu}/${pkgVersion}`;
    const bytedancePkgRoot = `${bytedance}/${pkgVersion}`;
    const staticfilePkgRoot = `${staticfile}/${pkgVersion}`;

    list.push(
      { [cdnjsPkgRoot]: `${cdnjsPkgRoot}/${file}` },
      { [bootcdnPkgRoot]: `${bootcdnPkgRoot}/${file}` },
      { [baomituPkgRoot]: `${baomituPkgRoot}/${file}` },
      { [bytedancePkgRoot]: `${bytedancePkgRoot}/${file}` },
      { [staticfilePkgRoot]: `${staticfilePkgRoot}/${file}` },
    );
  }

  // eslint-disable-next-line no-console
  console.log(list);
}
