/* eslint-disable @typescript-eslint/no-use-before-define */

import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';
import MagicString from 'magic-string';
import fs from 'fs-extra';
import docs from '../../../meta/docs.json';

export function MarkdownTransform(): Plugin {
  return {
    name: 'mixte-markdown-transform',
    enforce: 'pre',
    async transform(code, id, options) {
      if (!id.endsWith('.md')) return;

      const [, fn,, pkg] = id.split('/').reverse();

      if (Reflect.has(docs, pkg) && docs[pkg as keyof typeof docs].includes(fn)) {
        const s = new MagicString(code);

        // 添加标题
        s.prepend(`# ${fn}\n\n`);

        // 文档为空时添加提示
        if (!code.trim())
          s.append(emptyMd);

        // 添加 Demo
        if (await fs.pathExists(resolve(dirname(id), 'demo.vue'))) {
          const index = code.indexOf('\n##');

          if (index > -1) s.appendLeft(index, demoMd);
          else s.append(demoMd);

          s.append(demoScript);
        }

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }),
        };
      }
    },
  };
}

const emptyMd = `
<br>\n
::: warning 啊
文档还没写呢 ...
:::
`;

const demoMd = `
## 演示

<DemoCard>
  <Demo />
</DemoCard>
`;
const demoScript = `
<script setup>
  import Demo from \'./demo.vue\';
</script>
`;
