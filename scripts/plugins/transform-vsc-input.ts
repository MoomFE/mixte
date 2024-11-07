import type { LastArrayElement } from 'type-fest';
import type { PluginOption } from 'vite';
import type { packages } from '../../meta/packages';
import { fileURLToPath } from 'node:url';
import { generateCode, parseModule } from 'magicast';
import { dirname, resolve } from 'pathe';
import { normalizePath } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function transformVscInput(info: LastArrayElement<typeof packages>): PluginOption {
  const input = resolve(__dirname, `../../${info.input}`);

  return {
    name: 'transform-vsc-input',
    enforce: 'pre',
    transform(code, id) {
      if (normalizePath(id) !== input) return;

      const mod = parseModule(code);

      Object.values(mod.imports).forEach((item) => {
        if (item.from.startsWith('./src/')) {
          item.from = item.from.replace('./src/', `./${info.outputFileName}/`);
        }
      });

      return generateCode(mod);
    },
  };
}
