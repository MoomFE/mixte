import type { UserConfig } from 'tsdown';
import process from 'node:process';
import esbuild from 'esbuild';
import fs from 'fs-extra';
import { basename, extname, resolve } from 'pathe';
import { build } from 'tsdown';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/rollup';
import Components from 'unplugin-vue-components/rollup';
import Vue from 'unplugin-vue/rolldown';
import { normalizePath } from 'vite';

/** 需要排除的依赖 ( 支持字符串与正则 ) */
export type ExternalOption = (string | RegExp)[];

/**
 * 打包入口配置
 */
export interface LibConfig {
  /**
   * 打包入口文件
   */
  entry?: string;
  /**
   * 输出文件名
   * @default 打包入口文件名
   */
  outputFileName?: string;
  /**
   * 需要排除的依赖
   */
  external?: ExternalOption;
  /**
   * 打包 dts 时需要排除的依赖
   */
  dtsExternal?: ExternalOption;
  /**
   * 是否是 vue 组件
   *  - 使用 vue-tsc 预生成的 dts 打包类型
   */
  vueComponent?: boolean;
  /**
   * dts 打包所使用的 vue-tsc 预生成文件路径 ( 相对于 `dist/dts` )
   *  - 默认根据 `outputFileName` 自动推导 ( `<outputFileName>/index.d.ts` 或 `<outputFileName>.d.ts` )
   */
  vueDtsInput?: string;
  /**
   * 拷贝文件
   */
  copy?: { from: string; to: string }[];
}

/** 带有打包入口的配置 ( `buildLib` 的调用前提 ) */
interface BuildEntryConfig extends LibConfig {
  entry: string;
}

/** 入口的输出文件名 ( 默认取入口文件名 ) */
export function resolveOutputFileName(lib: BuildEntryConfig) {
  return lib.outputFileName ?? basename(lib.entry, extname(lib.entry));
}

/** 是否需要从 vue-tsc 预生成产物中打包 dts */
export function usesDtsInput(lib: LibConfig) {
  return !!lib.vueComponent || !!lib.vueDtsInput;
}

/** 打包所需读取的 `tsconfig.build.json` 字段 */
interface BuildTsconfig {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
}

/** 打包所需读取的 `package.json` 字段 */
interface BuildPackageJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/** 将 JSX 转译为 Vue 运行时 ( rolldown 会遵循 tsconfig 的 `jsx: preserve` 而保留 JSX ) */
async function transformJsx(code: string) {
  const result = await esbuild.transform(code, {
    loader: 'tsx',
    jsx: 'automatic',
    jsxImportSource: 'vue',
  });

  return { code: result.code };
}

/**
 * 打包单个入口
 *  - 产物为 `.mjs` / `.cjs` / `.d.ts`, 输出到包内 `dist/`
 *  - vue 组件及声明了 `vueDtsInput` 的入口从 vue-tsc 预生成产物中打包 dts
 */
export async function buildLib(lib: BuildEntryConfig) {
  const rootDir = normalizePath(process.cwd());

  const tsconfigPath = resolve(rootDir, 'tsconfig.build.json');
  const tsconfig = await fs.readJson(tsconfigPath, 'utf-8') as BuildTsconfig;

  const packageJson = await fs.readJson(resolve(rootDir, 'package.json'), 'utf-8') as BuildPackageJson;

  const alias = Object.fromEntries(
    Object.entries(tsconfig.compilerOptions?.paths ?? {}).map(([key, paths]) => {
      return [
        key,
        resolve(rootDir, paths[0]),
      ];
    }),
  );

  const external = [
    ...new Set([
      /^@?mixte(\/|$)/,
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.peerDependencies ?? {}),
      ...lib.external ?? [],
    ]),
  ];

  const dtsExternal = [
    ...new Set([
      ...external,
      ...lib.dtsExternal ?? [],
    ]),
  ];

  const outputFileName = resolveOutputFileName(lib);

  // 需要从 vue-tsc 预生成产物中打包 dts 的入口
  const useDtsInput = usesDtsInput(lib);

  // 各入口构建的公共配置
  const sharedConfig: UserConfig = {
    cwd: rootDir,
    outDir: 'dist',
    clean: false,
    alias,
    inputOptions: {
      checks: {
        bundlerTimings: false,
      },
      resolve: {
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      },
    },
    logLevel: 'warn',
    report: false,
    checks: {
      legacyCjs: false,
    },
  };

  // dts 构建的公共配置
  const dtsConfig = { tsconfig: tsconfigPath, newContext: true };

  // 打包 .mjs, .cjs 文件
  await build({
    ...sharedConfig,
    entry: {
      [outputFileName]: lib.entry,
    },
    format: {
      esm: {
        // vue 组件的 .d.ts 由 vue-tsc 预生成产物打包, 见下方
        dts: useDtsInput ? false : dtsConfig,
      },
      cjs: {
        dts: false,
      },
    },
    platform: 'browser',
    outExtensions: ({ format }) => {
      return {
        js: format === 'cjs' ? '.cjs' : '.mjs',
        dts: '.d.ts',
      };
    },
    deps: {
      neverBundle: external,
      dts: {
        neverBundle: dtsExternal,
      },
      onlyBundle: false,
    },
    plugins: [
      Icons({
        scale: 1,
        compiler: 'vue3',
      }),
      {
        name: 'mixte:transform-jsx',
        async transform(code, id) {
          // .vue 内 lang="tsx" 的脚本块
          if (id.includes('.vue?vue&') && id.includes('lang.tsx')) {
            return transformJsx(code);
          }
        },
      },
      lib.vueComponent && [
        Vue({
          isProduction: true,
          template: {
            compilerOptions: { comments: false },
          },
        }),
        Components({
          dts: false,
          dirs: [],
          resolvers: [
            IconsResolver({ prefix: 'i' }),
          ],
        }),
      ],
    ],
    outputOptions: {
      codeSplitting: false,
    },
  });

  if (useDtsInput) {
    // dts 打包入口: 优先使用显式指定, 否则按 `outputFileName` 推导
    let dtsInputPath = lib.vueDtsInput ? `dist/dts/${lib.vueDtsInput}` : '';

    if (!dtsInputPath) {
      dtsInputPath = await fs.exists(`${rootDir}/dist/dts/${outputFileName}/index.d.ts`)
        ? `dist/dts/${outputFileName}/index.d.ts`
        : `dist/dts/${outputFileName}.d.ts`;
    }

    // 打包 vue 组件的 .d.ts 文件
    await build({
      ...sharedConfig,
      entry: {
        [outputFileName]: dtsInputPath,
      },
      format: 'esm',
      dts: {
        dtsInput: true,
        emitDtsOnly: true,
        ...dtsConfig,
      },
      outExtensions: () => {
        return {
          dts: '.d.ts',
        };
      },
      deps: {
        neverBundle: dtsExternal,
        onlyBundle: false,
      },
    });
  }
}
